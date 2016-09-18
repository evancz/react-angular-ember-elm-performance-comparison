(ns todomvc.app
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [secretary.macros :refer [defroute]])
  (:require [goog.events :as events]
            [cljs.core.async :refer [put! <! chan]]
            [om.core :as om]
            [om.dom :as dom]
            [secretary.core :as secretary]
            [todomvc.utils :refer [pluralize now guid store hidden]]
            [clojure.string :as string]
            [todomvc.item :as item])
  (:import [goog History]
           [goog.history EventType]))

(enable-console-print!)

(def ENTER_KEY 13)

(def app-state (atom {:showing :all :todos []}))

;; =============================================================================
;; Routing

(defroute "/" [] (swap! app-state assoc :showing :all))

(defroute "/:filter" [filter] (swap! app-state assoc :showing (keyword filter)))

(def history (History.))

(events/listen history EventType.NAVIGATE
  (fn [e] (secretary/dispatch! (.-token e))))

(.setEnabled history true)

;; =============================================================================
;; Main and Footer Components

(declare toggle-all)

(defn visible? [todo filter]
  (case filter
    :all true
    :active (not (:completed todo))
    :completed (:completed todo)))

(defn main [{:keys [todos showing editing] :as app} comm]
  (dom/section #js {:className "main" :style (hidden (empty? todos))}
    (dom/input
      #js {:className "toggle-all" :type "checkbox"
           :onChange #(toggle-all % app)
           :checked (every? :completed todos)})
    (apply dom/ul #js {:className "todo-list"}
      (om/build-all item/todo-item todos
        {:init-state {:comm comm}
         :key :id
         :fn (fn [todo]
               (cond-> todo
                 (= (:id todo) editing) (assoc :editing true)
                 (not (visible? todo showing)) (assoc :hidden true)))}))))

(defn make-clear-button [completed comm]
  (when (pos? completed)
    (dom/button
      #js {:className "clear-completed"
           :onClick #(put! comm [:clear (now)])}
      (str "Clear completed (" completed ")"))))

(defn footer [app count completed comm]
  (let [clear-button (make-clear-button completed comm)
        sel (-> (zipmap [:all :active :completed] (repeat ""))
                (assoc (:showing app) "selected"))]
    (dom/footer #js {:className "footer" :style (hidden (empty? (:todos app)))}
      (dom/span #js {:className "todo-count"}
        (dom/strong nil count)
        (str " " (pluralize count "item") " left"))
      (dom/ul #js {:className "filters"}
        (dom/li nil (dom/a #js {:href "#/" :className (sel :all)} "All"))
        (dom/li nil (dom/a #js {:href "#/active" :className (sel :active)} "Active"))
        (dom/li nil (dom/a #js {:href "#/completed" :className (sel :completed)} "Completed")))
      clear-button)))

;; =============================================================================
;; Todos

(defn toggle-all [e app]
  (let [checked (.. e -target -checked)]
    (om/transact! app :todos
      (fn [todos] (vec (map #(assoc % :completed checked) todos))))))

(defn handle-new-todo-keydown [e app owner]
  (when (== (.-which e) ENTER_KEY)
    (let [new-field (om/get-node owner "newField")]
      (when-not (string/blank? (.. new-field -value trim))
        (let [new-todo {:id (guid)
                        :title (.-value new-field)
                        :completed false}]
          (om/transact! app :todos
            #(conj % new-todo)
            [:create new-todo]))
        (set! (.-value new-field) "")))
    false))

(defn destroy-todo [app {:keys [id]}]
  (om/transact! app :todos
    (fn [todos] (into [] (remove #(= (:id %) id) todos)))
    [:delete id]))

(defn edit-todo [app {:keys [id]}] (om/update! app :editing id))

(defn save-todos [app] (om/update! app :editing nil))

(defn cancel-action [app] (om/update! app :editing nil))

(defn clear-completed [app]
  (om/transact! app :todos
    (fn [todos] (into [] (remove :completed todos)))))

(defn handle-event [type app val]
  (case type
    :destroy (destroy-todo app val)
    :edit    (edit-todo app val)
    :save    (save-todos app)
    :clear   (clear-completed app)
    :cancel  (cancel-action app)
    nil))

(def render-start nil)

(defn todo-app [{:keys [todos] :as app} owner]
  (reify
    om/IWillMount
    (will-mount [_]
      (let [comm (chan)]
        (om/set-state! owner :comm comm)
        (go (while true
              (let [[type value] (<! comm)]
                (handle-event type app value))))))
    om/IWillUpdate
    (will-update [_ _ _] (set! render-start (now)))
    om/IDidUpdate
    (did-update [_ _ _]
      (store "todos" todos))
    om/IRenderState
    (render-state [_ {:keys [comm]}]
      (let [active    (count (remove :completed todos))
            completed (- (count todos) active)]
        (dom/div nil
          (dom/header #js {:className "header"}
            (dom/h1 nil "todos")
            (dom/input
              #js {:ref "newField" :className "new-todo"
                   :placeholder "What needs to be done?"
                   :onKeyDown #(handle-new-todo-keydown % app owner)})
            (main app comm)
            (footer app active completed comm)))))))

(om/root todo-app app-state
  {:target (.querySelector js/document ".todoapp")})

(dom/render
  (dom/div nil
    (dom/p nil "Double-click to edit a todo")
    (dom/p nil
      (dom/a #js {:href "http://github.com/swannodette"}))
    (dom/p nil
      #js ["Part of"
           (dom/a #js {:href "http://todomvc.com"} "TodoMVC")]))
  (.querySelector js/document ".info"))
