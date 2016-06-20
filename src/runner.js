
// SETUP

if (!window.performance || !window.performance.now)
{
	throw new Error('These tests use performance.now() which is not supported by your browser.');
}



// RUNNER


function run(suite)
{
	document.getElementById('benchmark-frame').style.display = 'block';
	document.getElementById('sidebar-button').setAttribute('disabled', '');
	document.getElementById('sidebar-selector').setAttribute('disabled', '');

	runImplementations(suite, 0, function() {
		updateChart(suite);

		document.getElementById('benchmark-frame').style.display = 'none';
		document.getElementById('sidebar-button').removeAttribute('disabled');
		document.getElementById('sidebar-selector').removeAttribute('disabled');
	});
}



// RUN IMPLEMENTATIONS


function runImplementations(suite, index, done)
{
	var impl = suite.impls[index];
	console.log(impl.name);

	var frame = document.getElementById('benchmark-frame');

	frame.onload = function()
	{
		withFacts(0, frame.contentDocument, suite.getFacts, function(facts)
		{
			runSteps(facts, suite.steps, index, 0, [], function(results)
			{
				impl.results = results;
				impl.time = getTotalTime(results);
				console.log('  = ' + trunc(impl.time) + ' ms');

				++index;

				return (index < suite.impls.length)
					? runImplementations(suite, index, done)
					: done();
			});
		});
	}

	frame.src = impl.url;
}


function getTotalTime(results)
{
	var total = 0;
	for (var i = 0; i < results.length; i++)
	{
		total += results[i].sync;
		total += results[i].async;
	}
	return total;
}


function withFacts(tries, doc, getFacts, callback)
{
	if (tries > 5)
	{
		throw new Error('Could not get facts for this implementation.');
	}

	setTimeout(function() {
		var facts = getFacts(doc);
		typeof facts === 'undefined'
			? withFacts(tries + 1, doc, getFacts, callback)
			: callback(facts);
	}, 16 * Math.pow(2, tries));
}



/* RUN STEPS ***/


function runSteps(facts, steps, implIndex, index, results, done)
{
	var stepNode = document.getElementById(stepId(implIndex, index));
	stepNode.classList.add('running');

	timedStep(steps[index].work, facts, function(syncTime, asyncTime)
	{
		stepNode.classList.remove('running');
		console.log('  ' + trunc(syncTime) + ' + ' + trunc(asyncTime) + ' : ' + steps[index].name);
		results.push({
			name: steps[index].name,
			sync: syncTime,
			async: asyncTime
		});

		++index;

		if (index < steps.length)
		{
			return runSteps(facts, steps, implIndex, index, results, done)
		}

		return done(results);
	});
}


function trunc(time)
{
	return Math.round(time * 1000) / 1000;
}


function timedStep(work, facts, callback)
{
	// time all synchronous work
	var start = performance.now();
	work(facts);
	var end = performance.now();
	var syncTime = end - start;

	// time TWO rounds of asynchronous work
	var asyncStart = performance.now();
	setTimeout(function() {
		setTimeout(function() {
			var asyncEnd = performance.now();
			callback(syncTime, asyncEnd - asyncStart);
		}, 0)
	}, 0);

	// if anyone does more than two rounds, we do not capture it!
}



/* SETUP WORK LIST *********/


function setupWorklist(suite)
{
	var impls = suite.impls;
	var steps = suite.steps;

	var workList = document.getElementById('work-list');
	workList.innerHTML = '';

	for (var i = 0; i < impls.length; i++)
	{
		var stepsNode = document.createElement('ul');
		for (var j = 0; j < steps.length; j++)
		{
			var step = document.createElement('li');
			step.id = stepId(i, j);
			step.innerText = steps[j].name;
			stepsNode.appendChild(step);
		}

		var impl = document.createElement('li');
		var title = document.createTextNode(impls[i].name);
		impl.appendChild(title);
		impl.appendChild(stepsNode);

		workList.appendChild(impl);
	}

	var sidebar = document.getElementById('sidebar');
	sidebar.appendChild(workList);
}


function stepId(i, j)
{
	return 'step-' + i + '-' + j;
}



/* DRAW CHARTS *************/


function updateChart(suite)
{
	/*
	google.load("visualization", "1", { packages: ["corechart"] });

	var rawData = [ [ "Project" , "Time", { role: "style" } ] ];

	for (var i = 0; i < suite.impls.length; i++)
	{
		var color = 'rgb(140, 217, 140)';
		var impl = suite.impls[i];
		rawData.push([ impl.name, impl.time, color ]);
	}

	var data = google.visualization.arrayToDataTable(rawData);

	var view = new google.visualization.DataView(data);
	view.setColumns([
		0,
		1,
		{
			calc: "stringify",
			sourceColumn: 1,
			type: "string",
			role: "annotation"
		},
		2
	]);

	var options = {
		title: "Benchmark Results",
		width: 600,
		height: 400,
		legend: {
			position: "none"
		},
		backgroundColor: 'transparent',
		hAxis: {
			title: 'Total time in milliseconds (lower is better)'
		}
	};

	var results = document.getElementById('benchmark-results');
	results.innerHTML = '';
	var barchart = document.createElement('div');
	results.appendChild(barchart);

	var chart = new google.visualization.BarChart(barchart);
	chart.draw(view, options);
	*/
}
