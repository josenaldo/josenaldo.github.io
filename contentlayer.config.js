import { defineDocumentType, makeSource } from 'contentlayer/source-files'

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
    where: {
      type: 'string',
      description: 'The period, in time, of the experience',
      required: true,
    },

    description: {
      type: 'string',
      description: 'The description of the experience',
      required: true,
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Project, Experience],
})
