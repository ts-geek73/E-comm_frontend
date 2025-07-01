import { IProductData } from "./product"

export interface StockDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stockEntry?: IStockEntry
  products: IProductData[]
  onSave: (entry: IStockEntry) => void
  email: string
}

export interface IBasicFormType {
  stock_name: string,
  description: string,
  added_by: string,
}

export const defultBasicForm: IBasicFormType ={
  stock_name: "",
  description: "",
  added_by: ""
}

export interface ProductEntry {
  product_id: string
  quantity: number
}

export interface IStockEntry {
    _id?: string
    stock_name: string
    description?: string
    date: Date,
    products: ProductEntry[]
    added_by: string;
}