
var suite = function() {


// IMPLEMENTATIONS


var impls = [
	{
		name: 'React 15.1.0',
		url: 'benchmarks/todomvc/react-15.1.0/index.html'
	},
	{
		name: 'React 15.1.0 + sCU',
		url: 'benchmarks/todomvc/react-15.1.0-lazy/index.html'
	},
	{
		name: 'Angular 1.5.7',
		url: 'benchmarks/todomvc/angular-1.5.7/index.html'
	},
	{
		name: 'Angular 1.5.7 optimized',
		url: 'benchmarks/todomvc/angular-1.5.7-optimized/index.html'
	},
	{
		name: 'Ember 2.6.2',
		url: 'benchmarks/todomvc/ember-2.6.2/dist/index.html'
	},
	// {
	// 	name: 'Elm 0.16',
	// 	url: 'benchmarks/todomvc/elm-0.16/index.html'
	// },
	// {
	// 	name: 'Elm 0.16 + lazy',
	// 	url: 'benchmarks/todomvc/elm-0.16-lazy/index.html'
	// },
	{
		name: 'Elm 0.17',
		url: 'benchmarks/todomvc/elm-0.17/index.html'
	},
	{
		name: 'Elm 0.17 + lazy',
		url: 'benchmarks/todomvc/elm-0.17-lazy/index.html'
	}
];



// STEPS


var steps = addCompleteDeleteSteps(100);


function addCompleteDeleteSteps(numItems)
{
	var steps = [];

	for (var i = 0; i < numItems; i++)
	{
		steps.push({ name: 'Inputing ' + i, work: inputTodo(i) });
		steps.push({ name: 'Entering ' + i, work: pressEnter });
	}

	for (var i = 0; i < numItems; i++)
	{
		steps.push({ name: 'Checking ' + i, work: click('toggle', i) });
	}

	for (var i = 0; i < numItems; i++)
	{
		steps.push({ name: 'Removing ' + i, work: click('destroy', 0) });
	}

	return steps;
}


function inputTodo(number)
{
	return function(facts)
	{
		var node = facts.input;

		var inputEvent = document.createEvent('Event');
		inputEvent.initEvent('input', true, true);
		node.value = 'Do task ' + number;
		node.dispatchEvent(inputEvent);
	};
}


function pressEnter(facts)
{
	var keydownEvent = document.createEvent('Event');
	keydownEvent.initEvent('keydown', true, true);
	keydownEvent.keyCode = 13;
	facts.input.dispatchEvent(keydownEvent);
}


function click(className, index)
{
	return function(facts)
	{
		facts.doc.getElementsByClassName(className)[index].click();
	};
}



// FACTS


function getFacts(doc)
{
	var input = doc.getElementsByClassName('new-todo')[0];
	return input ? { doc: doc, input: input } : undefined;
}



// SUITE


return {
	impls: impls,
	steps: steps,
	getFacts: getFacts
};


}();
