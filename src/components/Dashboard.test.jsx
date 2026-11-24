import { render, screen } from '@testing-library/react'
import Dashboard from './Dashboard'
import { describe, expect, test } from 'vitest'

describe('Dashboard component', () => {
  test('renders a Table element', () => {
    render(<Dashboard />)

    const tableElement = screen.getByRole('table');
    expect(tableElement).not.toBeNull();
  })
})