// Define custom options
var options = {

  // Don't perform an actual copy
  dryRun: true
};

// Instantiate with custom options
var copyGitHubLabels = require('../index.js')(options);

var source = 'jvandemo/copy-github-labels';
var destination = 'your-username/your-repo';

var i=0;

copyGitHubLabels.authenticate({
  type: 'token',
  token: 'your-github-api-token'
});

// Copy labels from one repository to another
copyGitHubLabels.copy(source, destination, function (err, label){

  i++;

  // Handle errors
  if(err){
    return console.log(i + ': Could not copy label: ' + JSON.stringify(err));
  }

  // Copy succeeded
  console.log(i + ': Label copied successfully: ' + JSON.stringify(label))
});
