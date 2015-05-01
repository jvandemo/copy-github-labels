// Define custom options
var options = {

  // Don't perform an actual copy
  dryRun: true
};

// Instantiate with custom options
var copyGitHubLabels = require('../index.js')(options);


var source = 'jvandemo/copy-github-labels';
var destination = 'your-username/your-repo';

// Copy labels from one repository to another
copyGitHubLabels.copy(source, destination, function (err, label){

  // Handle errors
  if(err){
    return console.log('Could not copy label: ' + JSON.stringify(err));
  }

  // Copy succeeded
  console.log('Label copied successfully: ' + JSON.stringify(label))
});
