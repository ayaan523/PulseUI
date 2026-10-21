import test from 'node:test'
import assert from 'node:assert/strict'
import { rows } from '../src/data/dashboardData.js'
import { filterAndSortActivities } from '../src/utils/tableUtils.js'

test('filters activity by search and status', () => {
  const result = filterAndSortActivities(rows, 'invoice', 'Completed', { key: 'date', direction: 'desc' })
  assert.ok(result.length > 0)
  assert.ok(result.every(row => row.activity === 'Invoice paid' && row.status === 'Completed'))
})

test('sorts amount ascending and descending', () => {
  const ascending = filterAndSortActivities(rows, '', 'All status', { key: 'amount', direction: 'asc' })
  const descending = filterAndSortActivities(rows, '', 'All status', { key: 'amount', direction: 'desc' })
  assert.equal(ascending[0].amount, 0)
  assert.equal(descending[0].amount, 499)
})
