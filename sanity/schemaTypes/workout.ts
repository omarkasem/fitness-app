import { defineType, defineField, defineArrayMember } from 'sanity'

export const workout = defineType( {
  name: 'workout',
  title: 'Workout',
  type: 'document',
  description: 'Workout session schema for tracking user exercise sessions',
  fields: [
    defineField( {
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'Clerk user ID of the person who performed this workout',
      validation: ( Rule ) => Rule.required()
    } ),
    defineField( {
      name: 'date',
      title: 'Workout Date',
      type: 'datetime',
      description: 'Date and time when the workout was performed',
      validation: ( Rule ) => Rule.required(),
      initialValue: ( ) => new Date().toISOString()
    } ),
    defineField( {
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      description: 'Total workout duration in seconds',
      validation: ( Rule ) => Rule.required().min( 1 ).integer()
    } ),
    defineField( {
      name: 'exercises',
      title: 'Exercises',
      type: 'array',
      description: 'List of exercises performed in this workout',
      of: [
        defineArrayMember( {
          type: 'object',
          name: 'workoutExercise',
          title: 'Workout Exercise',
          fields: [
            defineField( {
              name: 'exercise',
              title: 'Exercise',
              type: 'reference',
              to: [{ type: 'exercise' }],
              validation: ( Rule ) => Rule.required()
            } ),
            defineField( {
              name: 'sets',
              title: 'Sets',
              type: 'array',
              description: 'Individual sets performed for this exercise',
              of: [
                defineArrayMember( {
                  type: 'object',
                  name: 'exerciseSet',
                  title: 'Exercise Set',
                  fields: [
                    defineField( {
                      name: 'reps',
                      title: 'Repetitions',
                      type: 'number',
                      description: 'Number of repetitions performed',
                      validation: ( Rule ) => Rule.required().min( 1 ).integer()
                    } ),
                    defineField( {
                      name: 'weight',
                      title: 'Weight',
                      type: 'number',
                      description: 'Weight used for this set',
                      validation: ( Rule ) => Rule.min( 0 )
                    } ),
                    defineField( {
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      type: 'string',
                      description: 'Unit of measurement for the weight',
                      options: {
                        list: [
                          { title: 'Pounds (lbs)', value: 'lbs' },
                          { title: 'Kilograms (kg)', value: 'kg' }
                        ],
                        layout: 'radio'
                      },
                      initialValue: 'lbs',
                      validation: ( Rule ) => Rule.required()
                    } )
                  ],
                  preview: {
                    select: {
                      reps: 'reps',
                      weight: 'weight',
                      weightUnit: 'weightUnit'
                    },
                    prepare( { reps, weight, weightUnit } ) {
                      return {
                        title: `${reps} reps`,
                        subtitle: weight ? `${weight} ${weightUnit}` : 'Bodyweight'
                      }
                    }
                  }
                } )
              ],
              validation: ( Rule ) => Rule.required().min( 1 )
            } )
          ],
          preview: {
            select: {
              exerciseName: 'exercise.name',
              sets: 'sets'
            },
            prepare( { exerciseName, sets } ) {
              const setCount = sets ? sets.length : 0
              return {
                title: exerciseName || 'Unknown Exercise',
                subtitle: `${setCount} set${setCount !== 1 ? 's' : ''}`
              }
            }
          }
        } )
      ],
      validation: ( Rule ) => Rule.required().min( 1 )
    } )
  ],
  preview: {
    select: {
      date: 'date',
      duration: 'duration',
      exercises: 'exercises',
      userId: 'userId'
    },
    prepare( { date, duration, exercises, userId } ) {
      const workoutDate = date ? new Date( date ).toLocaleDateString() : 'Unknown Date'
      const durationMinutes = duration ? Math.round( duration / 60 ) : 0
      const exerciseCount = exercises ? exercises.length : 0
      
      return {
        title: `Workout - ${workoutDate}`,
        subtitle: `${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''} • ${durationMinutes} min • User: ${userId?.slice( -8 ) || 'Unknown'}`
      }
    }
  },
  orderings: [
    {
      title: 'Date (newest first)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }]
    },
    {
      title: 'Date (oldest first)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }]
    },
    {
      title: 'Duration (longest first)',
      name: 'durationDesc',
      by: [{ field: 'duration', direction: 'desc' }]
    }
  ]
} )
