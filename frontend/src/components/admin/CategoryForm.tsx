import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Select,
  TextInput,
  Label,
  Alert,
  Spinner,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { useCreateCategory, useEditCategory } from "../../hooks/mutations";
import axios from "axios";
import { useCategories } from "../../hooks/queries";
import type { ICategory } from "../../api/category.api";
import { HiInformationCircle } from "react-icons/hi";

export function CategoryForm({
  openModal,
  setOpenModal,
  categoryToEdit,
}: {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  categoryToEdit: ICategory | null;
}) {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [validationError, setValidationError] = useState("");
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const { mutate, isPending, error } = useCreateCategory();
  const {
    mutate: editMutate,
    isPending: editIsPending,
    error: editError,
  } = useEditCategory();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  useEffect(() => {
    if (openModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName("");
      setParentCategory("");
      setValidationError("");
    }
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      const pId =
        typeof categoryToEdit.parent === "object"
          ? categoryToEdit.parent?._id
          : categoryToEdit.parent;

      setParentCategory(pId || "");
    }
  }, [openModal, categoryToEdit]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (validationError) setValidationError("");
  };

  const addCategory = () => {
    if (!name.trim()) {
      setValidationError("Category name is required");
      return;
    }
    if (name.trim().length < 2) {
      setValidationError("Category name must be at least 2 characters");
      return;
    }

    const categoryData: ICategory = {
      name: name.trim(),
      slug,
      ...(parentCategory && { parent: parentCategory }),
    };

    mutate(categoryData, {
      onSuccess: () => {
        setOpenModal(false);
        setName("");
        setParentCategory("");
        setValidationError("");
      },
    });
  };

  const editCategory = (id: string) => {
    if (!name.trim()) {
      setValidationError("Category name is required");
      return;
    }
    if (name.trim().length < 2) {
      setValidationError("Category name must be at least 2 characters");
      return;
    }

    const categoryData: ICategory = {
      name: name.trim(),
      slug,
      parent: parentCategory || null
    };

    editMutate(
      { id, categoryData },
      {
        onSuccess: () => {
          setOpenModal(false);
          setName("");
          setParentCategory("");
          setValidationError("");
        },
      }
    );
  };

  return (
    <Modal size="md" show={openModal} onClose={() => setOpenModal(false)}>
      <ModalHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">
            {categoryToEdit ? "Edit Category" : "Create New Category"}
          </span>
        </div>
      </ModalHeader>
      <ModalBody className="space-y-6 p-6">
        {axios.isAxiosError(error) && (
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">Error!</span>{" "}
            {error?.response?.data?.message || "Failed to create category"}
          </Alert>
        )}
        {axios.isAxiosError(editError) && (
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">Error!</span>{" "}
            {editError?.response?.data?.message || "Failed to create category"}
          </Alert>
        )}

        {validationError && (
          <Alert color="warning" icon={HiInformationCircle}>
            <span className="font-medium">Validation Error!</span>{" "}
            {validationError}
          </Alert>
        )}

        <div className="space-y-2">
          <div className="mb-1.5">
            <Label htmlFor="category-name" className="font-medium">
              Category Name
            </Label>
          </div>
          <TextInput
            id="category-name"
            onChange={handleNameChange}
            value={name}
            placeholder="e.g., Electronics, Clothing, Books"
            color={validationError ? "failure" : "gray"}
            disabled={isPending}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter a descriptive name for your category
          </p>
        </div>

        <div className="space-y-2">
          <div className="mb-1.5">
            <Label htmlFor="category-slug" className="font-medium">
              URL Slug
            </Label>
          </div>
          <TextInput
            id="category-slug"
            value={slug || "auto-generated-slug"}
            placeholder="Auto-generated from name"
            disabled
            color="gray"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Automatically generated from category name
          </p>
        </div>

        <div className="space-y-2">
          <div className="mb-1 5">
            <Label htmlFor="parent-category" className="font-medium">
              Parent Category (Optional)
            </Label>
          </div>
          {isCategoriesLoading ? (
            <div className="flex items-center justify-center py-3">
              <Spinner size="md" />
              <span className="ml-2 text-sm text-gray-500">
                Loading categories...
              </span>
            </div>
          ) : (
            <Select
              id="parent-category"
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              disabled={isPending}
            >
              <option value="">None (Top-level category)</option>
              {(categories?.categories as ICategory[])
                .filter((cat) => cat._id !== categoryToEdit?._id)
                ?.map((category) => (
                  <option value={category._id} key={category._id}>
                    {category.name}
                  </option>
                ))}
            </Select>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select a parent to create a subcategory
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            color="gray"
            onClick={() => setOpenModal(false)}
            className="flex-1"
            disabled={isPending || editIsPending}
          >
            Cancel
          </Button>
          {categoryToEdit ? (
            <Button
              color="green"
              className="flex-1"
              onClick={() => editCategory(categoryToEdit._id as string)}
              disabled={editIsPending || !name.trim()}
            >
              {isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Editing...
                </>
              ) : (
                "Edit Category"
              )}
            </Button>
          ) : (
            <Button
              disabled={isPending || !name.trim()}
              onClick={addCategory}
              className="flex-1"
            >
              {isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}
