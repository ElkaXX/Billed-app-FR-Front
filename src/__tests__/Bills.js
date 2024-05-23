/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import router from "../app/Router";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
    });
    // test("Then bills should be ordered from earliest to latest", () => {
    //   document.body.innerHTML = BillsUI({ data: bills });
    //   const dates = screen
    //     .getAllByText(
    //       /^(19|20)\d\d[- /.](0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])$/i
    //     )
    //     .map((a) => a.innerHTML);
    //   const antiChrono = (a, b) => (a < b ? 1 : -1);
    //   const datesSorted = [...dates].sort(antiChrono);
    //   expect(dates).toEqual(datesSorted);
    // });
  });

  describe("When I click on New Bill button", () => {
    test("Then should be navigated to new bill page", () => {
      document.body.innerHTML = BillsUI({ data: bills });

      const newBillBtn = screen.getByTestId("btn-new-bill");
      const mockNavigate = jest.fn();
      const mockStore = {};
      const mockLocalStorage = {};

      new Bills({
        document,
        onNavigate: mockNavigate,
        store: mockStore,
        localStorage: mockLocalStorage,
      });

      fireEvent.click(newBillBtn);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
    });
  });

  // Ajout de tests pour les erreurs 404 et 500
  describe("When fetches bills from an API and fails", () => {
    test("Then it should display a 404 error message", async () => {
      mockStore.bills = jest.fn().mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });

      window.onNavigate(ROUTES_PATH.Bills);
      //await new Promise(process.nextTick);
      waitFor(() => {
        const error = screen.getByTestId("error-message");
        expect(error.innerText).toBe("Erreur 404");
      });
    });

    test("Then it should display a 500 error message", async () => {
      mockStore.bills = jest.fn().mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      });

      window.onNavigate(ROUTES_PATH.Bills);

      waitFor(() => {
        const error = screen.getByTestId("error-message");
        expect(error.innerText).toBe("Erreur 500");
      });
      
    });
  });
});
