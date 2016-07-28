
var suite = function() {


// FACTS

function getFacts(doc)
{
	var input = doc.getElementsByClassName('new-todo')[0];
	return input ? { doc: doc, input: input } : undefined;
}


// STEPS

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


// SUITE

return {
	getFacts: getFacts,
	steps: addCompleteDeleteSteps(100)
};


}();
