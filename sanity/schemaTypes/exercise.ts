import { defineType, defineField } from 'sanity'

export const exercise = defineType( {
  name: 'exercise',
  title: 'Exercise',
  type: 'document',
  description: 'Exercise schema for fitness app with details about workout exercises',
  fields: [
    defineField( {
      name: 'name',
      title: 'Exercise Name',
      type: 'string',
      description: 'The name of the exercise',
      validation: ( Rule ) => Rule.required().min( 2 ).max( 100 )
    } ),
    defineField( {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Detailed description of how to perform the exercise',
      validation: ( Rule ) => Rule.required().min( 10 ).max( 500 )
    } ),
    defineField( {
      name: 'difficulty',
      title: 'Difficulty Level',
      type: 'string',
      description: 'The difficulty level of the exercise',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' }
        ],
        layout: 'radio'
      },
      validation: ( Rule ) => Rule.required()
    } ),
    defineField( {
      name: 'image',
      title: 'Exercise Image',
      type: 'image',
      description: 'Visual representation of the exercise',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Alternative text for screen readers and SEO',
          validation: ( Rule ) => Rule.required()
        }
      ]
    } ),
    defineField( {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'URL to a video demonstration of the exercise',
      validation: ( Rule ) => Rule.uri( {
        scheme: ['http', 'https']
      } )
    } ),
    defineField( {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Whether this exercise is currently active and available',
      initialValue: true
    } )
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'difficulty',
      media: 'image'
    }
  }
} )
