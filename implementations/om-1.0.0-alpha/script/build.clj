(require '[cljs.build.api :as b])

(b/build "src"
  {:output-to          "app.js"
   :output-dir         "out"
   :optimizations      :advanced
   :static-fns         true
   :optimize-constants true
   :pretty-print       true
   :externs            ["src/js/externs.js"]
   :closure-defines    '{goog.DEBUG false}
   :verbose            true})

(System/exit 0)
