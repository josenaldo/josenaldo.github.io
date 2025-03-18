import {
  allCourses as clAllCourses,
} from 'contentlayer/generated'

function lastCourses(numberOfCourses) {
  return clAllCourses
    .sort((a, b) => {
      return b.completionDate - a.completionDate
    })
    .slice(0, numberOfCourses)
}

function allCourses() {
  return clAllCourses.sort((a, b) => {
    const aDate = new Date(a.completionDate)
    const bDate = new Date(b.completionDate)
    return bDate - aDate
  })
}

export { allCourses, lastCourses }

