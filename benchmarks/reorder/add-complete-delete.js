
var suite = function() {


// IMPLEMENTATIONS


var impls = [
	{
		name: 'Elm 0.16',
		url: 'benchmarks/todomvc/elm-0.16/index.html'
	},
	{
		name: 'Elm 0.16 + lazy',
		url: 'benchmarks/todomvc/elm-0.16-lazy/index.html'
	},
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
	return [
		{
			name: 'Adding ' + numItems + ' Items',
			work: add(numItems)
		},
		{
			name: 'Completing All Items',
			work: clickAll('.toggle')
		},
		{
			name: 'Deleting All Items',
			work: clickAll('.destroy')
		}
	];
}


function add(numItems)
{
	return function(facts)
	{
		var node = facts.input;

		for (var i = 0; i < numItems; i++)
		{
			var inputEvent = document.createEvent('Event');
			inputEvent.initEvent('input', true, true);
			node.value = 'Do task ' + i;
			node.dispatchEvent(inputEvent);

			var keyupEvent = document.createEvent('Event');
			keyupEvent.initEvent('keyup', true, true);
			keyupEvent.keyCode = 13;
			node.dispatchEvent(keyupEvent);
		}
	};
}


function clickAll(selector)
{
	return function(facts)
	{
		var checkboxes = facts.doc.querySelectorAll(selector);
		for (var i = 0; i < checkboxes.length; i++)
		{
			checkboxes[i].click();
		}
	};
}



// FACTS


function getFacts(doc)
{
	var input = doc.getElementById('new-todo');
	return input ? { doc: doc, input: input } : undefined;
}



// SUITE


return {
	impls: impls,
	steps: steps,
	getFacts: getFacts
};


}();