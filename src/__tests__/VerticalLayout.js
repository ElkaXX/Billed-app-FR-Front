/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import VerticalLayout from "../views/VerticalLayout"
import { localStorageMock } from "../__mocks__/localStorage.js"

describe('Given I am connected as Employee', () => {
  describe('When I am on the Vertical Layout', () => {
    test("Then Icons should be rendered", () => {
      // Given
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({ type: 'Employee' })
      window.localStorage.setItem('user', user)
      
      // When
      const html = VerticalLayout(120)
      document.body.innerHTML = html
      
      // Then
      expect(screen.getByTestId('icon-window')).toBeTruthy()
      expect(screen.getByTestId('icon-mail')).toBeTruthy()
    })
  })
})
