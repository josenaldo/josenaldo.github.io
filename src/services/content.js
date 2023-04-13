import { allExperiences } from 'contentlayer/generated'

const lastExperiences = (numberOfExperiences) => {
  return allExperiences
    .sort((a, b) => {
      return a.id - b.id
    })
    .slice(0, numberOfExperiences)
}

export default { lastExperiences: lastExperiences }
