/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectsPage from '../src/app/projects/page';
import axios from 'axios';

// Mocking axios
jest.mock('axios');
const mockedAxios = jest.mocked(axios, true);

describe('ProjectsPage Component', () => {
  it('renders the ProjectsPage and toggles dark mode', async () => {
    // Mock API response for fetching projects
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { id: 1, title: 'Project 1', description: 'Test Project 1' },
        { id: 2, title: 'Project 2', description: 'Test Project 2' },
      ],
    });

    render(<ProjectsPage />);

    // Assert that project titles are rendered
    expect(await screen.findByText('Project 1')).toBeInTheDocument();
    expect(await screen.findByText('Project 2')).toBeInTheDocument();

    // Assert that the dark mode toggle icon is rendered
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();

    // Simulate clicking the dark mode toggle
    fireEvent.click(toggleButton);

    // After toggle, assert the body class changes to dark-mode
    expect(document.body.classList.contains('dark-mode')).toBe(true);
  });
});
