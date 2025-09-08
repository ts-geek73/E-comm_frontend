import { Button } from "@components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { IProductData } from "@types"
import { Plus, X } from "lucide-react"
import Image from "next/image"

const QuickView = ({ 
  products, 
  onClose, 
  onAddToCart, 
  onProductClick 
}: {
  products: IProductData[]
  onClose: () => void
  onAddToCart: (product: IProductData) => void
  onProductClick: (product: IProductData) => void
}) => {
  return (
    <Card className="min-w-[350px] bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            🔥 More Picks
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-indigo-100 rounded-full"
          >
            <X size={18} className="text-indigo-600" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 4).map((product, index) => (
            <Card
              key={product._id + index}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-indigo-300"
              onClick={() => onProductClick(product)}
            >
              <CardContent className="p-3">
                <div className="bg-gray-50 rounded-lg overflow-hidden mb-2">
                  <Image
                    src={product.image?.url || "/placeholder.svg?height=100&width=100"}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="w-full h-20 object-cover"
                  />
                </div>
                
                <h5 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-2">
                  {product.name}
                </h5>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-blue-600">
                    ₹{product.price}
                  </p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddToCart(product)
                    }}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-1.5"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickView;