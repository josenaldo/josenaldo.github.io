import { defineDocumentType, makeSource } from 'contentlayer2/source-files';

function resolveSlug(doc, folder) {
  const regex = new RegExp(`${folder}\/?`, 'g')
  const slug = doc._raw.flattenedPath.replace(regex, '');
  return slug
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.md`,
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    author: {
      type: 'string',
      description: 'The author of the post',
      required: true,
    },
    category: {
      type: 'string',
      description: 'The category of the post',
      required: true,
    },
    image: {
      type: 'string',
      description: 'The image of the post',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
  },
}))

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: `pages/**/*.md`,
  fields: {
    title: {
      type: 'string',
      description: 'The title of the page',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the page',
      required: true,
    },
    image: {
      type: 'string',
      description: 'The image of the page',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath.replace(/pages\/?/, '')}`,
    },
  },
}))

const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: `projects/**/*.md`,
  fields: {
    id: {
      type: 'number',
      description: 'The id of the project',
      required: true,
    },
    title: {
      type: 'string',
      description: 'The title of the project',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the project',
      required: true,
    },
    projectUrl: {
      type: 'string',
      description: 'The project url',
      required: true,
    },
    pin: {
      type: 'boolean',
      description: 'The project is pinned in the portfolio',
      required: true,
    },
    image: {
      type: 'string',
      description: 'The image of the project',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
  },
}))

const Experience = defineDocumentType(() => ({
  name: 'Experience',
  filePathPattern: `experiences/**/*.md`,
  fields: {
    id: {
      type: 'number',
      description: 'The id of the experience',
      required: true,
    },
    title: {
      type: 'string',
      description: 'The title of the experience',
      required: true,
    },
    company: {
      type: 'string',
      description: 'The company of the experience',
      required: true,
    },
    location: {
      type: 'string',
      description: 'The location of the experience',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the post',
      required: true,
    },
    period: {
      type: 'string',
      description: 'The period, in time, of the experience',
      required: true,
    },
    show: {
      type: 'boolean',
      description: 'Show the experience in the resume',
      required: true,
    }
  },
}))

const Testimonial = defineDocumentType(() => ({
  name: 'Testimonial',
  filePathPattern: `testimonials/**/*.md`,
  fields: {
    name: {
      type: 'string',
      description: 'The name of the testimonial author',
      required: true,
    },
    position: {
      type: 'string',
      description: 'The position of the testimonial author',
      required: true,
    },
    testimonial: {
      type: 'string',
      description: 'The testimonial',
      required: true,
    },
    image: {
      type: 'string',
      description: 'The image of the testimonial author',
      required: true,
    },
  },
}))

const Skill = defineDocumentType(() => ({
  name: 'Skill',
  filePathPattern: `skills/**/*.md`,
  fields: {
    name: {
      type: 'string',
      description: 'The name of the skill',
      required: true,
    },
    level: {
      type: 'string',
      description: 'The level of the skill',
      required: true,
    },
    firstContact: {
      type: 'number',
      description: 'The year of the first contact with the skill',
      required: true,
    },
  },
}))

const Course = defineDocumentType(() => ({
  name: 'Course',
  filePathPattern: `courses/**/*.md`,
  fields: {
    name: {
      type: 'string',
      description: 'The name of the course',
      required: true,
    },
    institution: {
      type: 'string',
      description: 'The institution of the course',
      required: true,
    },
    completionDate: {
      type: 'date',
      description: 'The completion month and year of the course',
      required: true,
    },
    workload: {
      type: 'number',
      description: 'The workload of the course, in hours',
      required: true,
    },
    courseLink: {
      type: 'string',
      description: 'The link of the course',
      required: true,
    },
    certificateLink: {
      type: 'string',
      description: 'The link of the certificate',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => resolveSlug(doc, 'courses'),
    }
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Page, Project, Experience, Testimonial, Skill, Course],
})
