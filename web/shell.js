var PythonShell = require('python-shell');

PythonShell.run('./../dashboard.py', {args: ['force']}, function (err) {
  if (err) throw err;
  console.log('finished');
});
