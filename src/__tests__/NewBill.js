/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then form should be in the document", () => {
      document.body.innerHTML = NewBillUI();

      const form = screen.getByTestId("form-new-bill");
      const expenseType = screen.getByTestId("expense-type");
 //
      // todo: add left inputs and labels
      expect(form).toBeTruthy();
      expect(expenseType).toBeTruthy();
    });
  });

  describe("When I click on submit button", () => {
    test("Then form should be submitted with correct values", () => {
      document.body.innerHTML = NewBillUI();

      const user = { email: "email@gmail.com" };

      const bill = {
        email: user.email,
        type: "Equipement et matériel",
        name: "testName",
        amount: 10,
        date: "2024-05-16",
        vat: 10,
        pct: 230,
        commentary: "testCommentary",
        fileUrl: null,
        fileName: null,
        status: "pending"
      };

      const form = screen.getByTestId("form-new-bill");

      const mockNavigate = jest.fn();
      const mockGetItem = jest.fn().mockReturnValue(JSON.stringify(user));
      const mockUpdate = jest.fn().mockReturnValue(Promise.resolve());

      const mockLocalStorage = {
        getItem: mockGetItem,
      };

      const mockStore = {
        bills: jest.fn().mockReturnValue({
          update: mockUpdate,
        }),
      };

      const newBill = new NewBill({
        document,
        onNavigate: mockNavigate,
        store: mockStore,
        localStorage: mockLocalStorage,
      });

      const expenseType = screen.getByTestId("expense-type");
      const name = screen.getByTestId("expense-name")
      const amount = screen.getByTestId("amount");
      const date = screen.getByTestId("datepicker");
      const vat = screen.getByTestId("vat");
      const pct = screen.getByTestId("pct");
      const commentary = screen.getByTestId("commentary");

      fireEvent.change(expenseType, {target: {value: bill.type}});
      fireEvent.change(name, {target: {value: bill.name}});
      fireEvent.change(amount, {target: {value: bill.amount}});
      fireEvent.change(date, {target: {value: bill.date}});
      fireEvent.change(vat, {target: {value: bill.vat}});
      fireEvent.change(pct, {target: {value: bill.pct}});
      fireEvent.change(commentary, {target: {value: bill.commentary}});

      fireEvent.submit(form, {target: form});

      expect(expenseType.value).toBe(bill.type);
      expect(name.value).toBe(bill.name);
      expect(parseInt(amount.value)).toBe(bill.amount);
      expect(date.value).toBe(bill.date);
      expect(parseInt(vat.value)).toBe(bill.vat);
      expect(parseInt(pct.value)).toBe(bill.pct);
      expect(commentary.value).toBe(bill.commentary)

      expect(mockUpdate).toHaveBeenCalled();

      waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]));
    })
  });
});
