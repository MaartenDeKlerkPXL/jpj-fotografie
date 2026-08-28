import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'v78po3b2',
    dataset: 'production'
  },
  // Studio staat live op https://jpj-fotografie.sanity.studio — dit appId
  // voorkomt dat een volgende `sanity deploy` er opnieuw naar vraagt.
  deployment: {
    appId: 'qw6j72y6erice7uw1ersbrr6'
  }
})
