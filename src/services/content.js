import { allExperiences, allProjects } from 'contentlayer/generated'

const lastExperiences = (numberOfExperiences) => {
  return allExperiences
    .sort((a, b) => {
      return b.id - a.id
    })
    .slice(0, numberOfExperiences)
}

const lastProjects = (numberOfProjects) => {
  return allProjects
    .sort((a, b) => {
      return a.id - b.id
    })
    .slice(0, numberOfProjects)
}

export default { lastExperiences: lastExperiences }
