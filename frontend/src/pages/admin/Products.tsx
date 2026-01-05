// frontend/src/pages/admin/Products.tsx
import { Button, Table, Spinner, Alert, TableHead, TableHeadCell, TableCell, TableBody, TableRow, Badge } from "flowbite-react";
import { useState } from "react";
import { ProductWizard } from "../../components/admin/ProductWizard";
import { useProducts } from "../../hooks/queries";
import { HiPencil, HiTrash, HiPlus, HiEye } from "react-icons/hi";
import type { IProduct } from "../../utils/types";
import { useDeleteProductMutation } from "../../hooks/mutations";
import { ProductDetailModal } from "../../components/modal/ProductDetail";

export function Products() {
    const [openModal, setOpenModal] = useState(false);
    const [openProductDetailModal, setOpenProductDetailModal] = useState(false)
    const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);
    const [product, setProduct] = useState<IProduct | null>(null)
    const { data: productsData, isLoading, error } = useProducts();
    const products = productsData?.products as IProduct[] || [];
    const {mutate} = useDeleteProductMutation()

    const handleEdit = (product: IProduct) => {
        setProductToEdit(product);
        setOpenModal(true);
    };

    const handleAddNew = () => {
        setProductToEdit(null);
        setOpenModal(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            mutate(id);
        }
    };

    const handleView = (product: IProduct) => {
        setProduct(product)
        setOpenProductDetailModal(true)
    }

    return (
        <div className="space-y-4 p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                    <HiPlus className="mr-2 h-5 w-5" />
                    Add Product
                </Button>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <Spinner size="xl" />
                    <span className="ml-3 text-lg">Loading products...</span>
                </div>
            )}

            {error && (
                <Alert color="failure">
                    <span className="font-medium">Error!</span> Failed to load products
                </Alert>
            )}

            {!isLoading && !error && products.length === 0 && (
                <Alert color="info">
                    <span className="font-medium">No products found.</span> Click "Add Product" to create your first product.
                </Alert>
            )}

            {!isLoading && !error && products.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>Product</TableHeadCell>
                            <TableHeadCell>Category</TableHeadCell>
                            <TableHeadCell>Price</TableHeadCell>
                            <TableHeadCell>Stock</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell>Actions</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {products.map((product) => (
                                <TableRow key={product._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        <div className="flex items-center">
                                            {product.images?.[0] && (
                                                <img
                                                    src={`http://localhost:3000/uploads/product-images/${product.images[0]}`}
                                                    alt={product.title}
                                                    className="h-10 w-10 rounded-md object-cover mr-3"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium">{product.title}</div>
                                                <div className="text-sm text-gray-500">{product.brand}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{typeof product.category === 'object' ? product.category.name : 'No Category'}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className={product.discountPrice ? "line-through text-gray-400" : "font-medium"}>
                                                ${product.price.toFixed(2)}
                                            </span>
                                            {product.discountPrice > 0 && (
                                                <span className="font-medium text-red-600">
                                                    ${product.discountPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {product.variants?.reduce((total, v) => total + (v.stock || 0), 0) || 0} in stock
                                    </TableCell>
                                    <TableCell>
                                        <Badge color={product.isFeatured ? "green" : "gray"} className="inline">
                                            {product.isFeatured ? "Featured" : "Regular"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button 
                                                size="xs" 
                                                color="blue" 
                                                className="px-3"
                                                onClick={() => handleView(product)}
                                            >
                                                <HiEye className="mr-1 h-4 w-4" />
                                                View
                                            </Button>
                                            <Button 
                                                size="xs" 
                                                color="green" 
                                                onClick={() => handleEdit(product)}
                                                className="px-3"
                                            >
                                                <HiPencil className="mr-1 h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button 
                                                size="xs" 
                                                color="red" 
                                                onClick={() => handleDelete(product._id as string)}
                                                className="px-3"
                                            >
                                                <HiTrash className="mr-1 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <ProductWizard 
                openModal={openModal} 
                setOpenModal={setOpenModal} 
                productToEdit={productToEdit}
            />

            <ProductDetailModal product={product} openProductDetailModal={openProductDetailModal} setOpenProductDetailModal={setOpenProductDetailModal} />
        </div>
    );
}