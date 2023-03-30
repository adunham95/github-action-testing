const core = require('@actions/core');
const github = require('@actions/github');
const { version } = require('./package.json');

async function run(){
try {
    const myVersion = `v${version}`
    console.log(`Version Number: ${myVersion}`)
    const myToken = core.getInput('token')
    const octokit = github.getOctokit(myToken)
    const {owner, repo} = github.context.repo
    const body = ""
    const latestRelease = await octokit.rest.repos.getLatestRelease({
        owner,
        repo
      })
      console.log('latestRelease', latestRelease)
      if (latestRelease.status !== 200) {
        throw Error(`Failed to get latest release (status=${latestRelease.status})`)
      }

      const releaseNotes= await octokit.rest.repos.generateReleaseNotes({
        owner,
        repo,
        tag_name: myToken,
        previous_tag_name: latestRelease.data.tag_name
      });

      console.log("releaseNotes", releaseNotes)

    //   await octokit.rest.repos.createRelease({
    //     owner,
    //     repo,
    //     tag_name: myVersion,
    //     body: body || ''
    //   })

  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
}
run()