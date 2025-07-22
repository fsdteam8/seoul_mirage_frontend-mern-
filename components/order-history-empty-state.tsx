import { Package, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function NotFoundComponent() {
    return (
        <div className="min-h-screen ">
            <div className="mx-auto container">
                {/* <h1 className="text-2xl font-bold text-gray-900 ">Order History</h1> */}
                <Card className="border-0 shadow-none bg-[#f9fafb]">
                    <CardContent className="p-12 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Package className="w-10 h-10 text-gray-400" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                                    <ShoppingBag className="w-3 h-3 text-orange-600" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mb-3">No orders yet</h2>

                        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                            {
                                "You haven't placed any orders yet. When you do, they'll appear here so you can track their progress and view details."
                            }
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href={'/products'}>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5">
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Start Shopping
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                           
                           <Link href={'/#category'}>
                            <Button variant="outline" className="px-6 py-2.5 bg-transparent">
                                Browse Categories
                            </Button>
                           </Link>
                        </div>

                        {/* <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500 mb-3">Need help finding something?</p>
                            <div className="flex flex-wrap justify-center gap-4 text-sm">
                                <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                                    Customer Support
                                </a>
                                <span className="text-gray-300">•</span>
                                <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                                    Track an Order
                                </a>
                                <span className="text-gray-300">•</span>
                                <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                                    Return Policy
                                </a>
                            </div>
                        </div> */}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
