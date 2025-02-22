// apps/backend/src/index.ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import type { Exam } from '@evs/shared'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use(cors())

// Mock data qui correspond exactement au mockup
const exams: Exam[] = [
  {
    student: { first_name: 'Isabella', last_name: 'S' },
    meeting_point: 'En attente',
    date: '2024-02-21T15:00:00Z',
    status: 'Recherche de place'
  },
  {
    student: { first_name: 'Franziska', last_name: 'S' },
    meeting_point: 'Martigues-B',
    date: '2024-06-16T14:00:00Z',
    status: 'Confirmé'
  },
  {
    student: { first_name: 'Lucas', last_name: 'R' },
    meeting_point: 'Martigues-B',
    date: '2024-06-21T17:00:00Z',
    status: 'A organiser'
  },
  {
    student: { first_name: 'Léo', last_name: 'C' },
    meeting_point: 'Martigues-B',
    date: '2024-05-26T13:00:00Z',
    status: 'Annulé'
  }
]

// Routes conformes au swagger fourni
app.get('/api/exams', (c) => {
  return c.json(exams)
})

app.post('/api/exams', async (c) => {
  const exam = await c.req.json<Exam>()
  exams.push(exam)
  return c.json(exam, 201)
})

serve(app, () => {
  console.log('Server is running on http://localhost:3000')
})