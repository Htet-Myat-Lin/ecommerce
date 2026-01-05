import { Button, Table, Spinner, Alert, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "flowbite-react";
import { useState } from "react";
import { CategoryForm } from "../../components/admin/CategoryForm";
import { useCategories } from "../../hooks/queries";
import type { ICategory } from "../../api/category.api";
import { HiInformationCircle, HiPencil, HiTrash } from "react-icons/hi";
import { useDeleteCategory } from "../../hooks/mutations";

export function Categories() {
    const [openModal, setOpenModal] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null)
    const { data: categoriesData, isLoading, error } = useCategories();
    const categories = categoriesData?.categories as ICategory[] || [];
    const {mutate} = useDeleteCategory()

    const getParentName = (parentId?: string) => {
        if (!parentId) return "None";
        const parent = categories.find(cat => cat._id === parentId);
        return parent?.name || "Unknown";
    };

    const handleEdit = (data: ICategory) => {
      setCategoryToEdit(data)
      setOpenModal(true)
    }

    const handleDelete = (id: string) => {
        if(!confirm("Are you sure to delete this category!")) return
        mutate(id)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
                <Button onClick={() => {setOpenModal(true); setCategoryToEdit(null)}}>Add category</Button>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <Spinner size="xl" />
                    <span className="ml-3 text-lg">Loading categories...</span>
                </div>
            )}

            {error && (
                <Alert color="failure" icon={HiInformationCircle}>
                    <span className="font-medium">Error!</span> Failed to load categories
                </Alert>
            )}

            {!isLoading && !error && categories.length === 0 && (
                <Alert color="info" icon={HiInformationCircle}>
                    <span className="font-medium">No categories yet.</span> Click "Add category" to create your first category.
                </Alert>
            )}

            {!isLoading && !error && categories.length > 0 && (
                <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell>Name</TableHeadCell>
                            <TableHeadCell>Slug</TableHeadCell>
                            <TableHeadCell>Parent Category</TableHeadCell>
                            <TableHeadCell>Actions</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {categories.map((category) => (
                                <TableRow key={category._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {category.name}
                                    </TableCell>
                                    <TableCell>{category.slug}</TableCell>
                                    <TableCell>{getParentName(typeof category?.parent === "object" ? category?.parent?._id : category?.parent)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="xs" color="green" onClick={()=>handleEdit(category)}>
                                                <HiPencil className="mr-1 h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button size="xs" color="red" onClick={() => handleDelete(category._id as string)}>
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

            <CategoryForm setOpenModal={setOpenModal} openModal={openModal} categoryToEdit={categoryToEdit} />
        </div>
    )
}