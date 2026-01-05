import { useProductFormStore } from "../../store/productFormStore";
import { useForm, FormProvider } from "react-hook-form";
import { productFormSchema, type ProductFormValues } from "../../utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../hooks/mutations";
import StepGeneral from "./steps/StepGeneral";
import StepVariantsSpecs from "./steps/StepVariantsSpecs";
import StepReview from "./steps/StepReview";
import { Modal, ModalHeader, ModalBody, Button, Spinner } from "flowbite-react";
import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { prepareProductFormData } from "../../api/product.api";
import type { IProduct } from "../../utils/types";
import axios from "axios";
import type { ICategory } from "../../api/category.api";

interface IModal {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  productToEdit: IProduct | null;
}

export function ProductWizard({
  openModal,
  setOpenModal,
  productToEdit = null,
}: IModal) {
  const { currentStep, nextStep, prevStep, totalSteps, resetStep } = useProductFormStore();

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      brand: "",
      description: "",
      price: 0,
      discountPrice: 0,
      category: "",
      images: [],
      isFeatured: false,
      rating: 0,
      variants: [],
      specifications: [],
    },
    mode: "onChange",
  });

  // Expand destructuring: add watch, setValue, reset, formState
  const { handleSubmit, trigger, watch, setValue, reset, formState } = methods;
  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation();

  // auto-generate slug from title (if slug is empty)
  const slugify = (s: string) =>
     s.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  // eslint-disable-next-line react-hooks/incompatible-library
  const titleValue = watch("title");
  const slugValue = watch("slug");
  // const images = watch("images")
  const existingImages = watch("existingImages")

  // Confirm close when dirty; also reset on close
  const handleClose = () => {
    if (formState.isDirty && !confirm("Discard unsaved changes?")) {
      return;
    }
    reset();
    resetStep();
    setOpenModal(false);
  };

  const handleNext = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fieldsToValidate: any[] = [];

    // Validate only current step fields before moving
    if (currentStep === 0) {
      fieldsToValidate = [
        "title",
        "slug",
        "brand",
        "description",
        "price",
        "discountPrice",
        "category",
        // ...(images!.length + existingImages!.length === 0 ? ["images"] : []),
        "isFeatured",
      ];
    } else if (currentStep === 1) {
      fieldsToValidate = ["variants", "specifications"];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) nextStep();
    else {
      // Smooth scroll to the first field with error on invalid step
      const firstErrorEl = document.querySelector('[aria-invalid="true"]');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const onSubmit = (data: ProductFormValues) => {
    // Transform specifications from array to Object for Backend
    const formattedSpecs = data.specifications.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.key]: curr.value,
      }),
      {}
    );

    const payload = prepareProductFormData({
      ...data,
      specifications: formattedSpecs,
      existingImages,
    });
    if (productToEdit) {
      updateProductMutation.mutate({id: productToEdit._id, data: payload});
    } else {
      createProductMutation.mutate(payload);
    }
  };

  // Smooth scroll on form-level errors
  const onError = () => {
    const firstErrorEl = document.querySelector('[aria-invalid="true"]');
    if (firstErrorEl) {
      firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Close and reset on successful mutation
  useEffect(() => {
    if (createProductMutation.isSuccess || updateProductMutation.isSuccess) {
      reset();
      resetStep();
      setOpenModal(false);
    }
  }, [createProductMutation.isSuccess,updateProductMutation.isSuccess, reset, resetStep, setOpenModal]);

  useEffect(() => {
    if (titleValue && !slugValue) {
      setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, slugValue, setValue]);

  // Initialize product data for editing
  useEffect(() => {
    if (!openModal) return;

    if (productToEdit) {
      reset({
        title: productToEdit.title,
        slug: productToEdit.slug,
        brand: productToEdit.brand,
        description: productToEdit.description,
        price: productToEdit.price,
        discountPrice: productToEdit.discountPrice ?? 0,
        category: (productToEdit.category as ICategory)._id,
        images: [],
        existingImages: productToEdit.images ?? [],
        isFeatured: productToEdit.isFeatured,
        rating: productToEdit.rating ?? 0,
        variants: productToEdit.variants ?? [],
        specifications: Object.entries(productToEdit.specifications || {}).map(
          ([key, value]) => ({ key, value })
        ),
      });
    } else {
      reset({
        title: "",
        slug: "",
        brand: "",
        description: "",
        price: 0,
        discountPrice: 0,
        category: "",
        images: [],
        existingImages: [],
        isFeatured: false,
        rating: 0,
        variants: [],
        specifications: [],
      });
    }
    resetStep();
  }, [openModal, productToEdit, reset, resetStep]);

  return (
    <Modal
      show={openModal}
      onClose={handleClose}
      size="5xl"
      className="relative"
    >
      <ModalHeader>
        <div className="flex items-center justify-between w-full pr-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full from-blue-600 to-blue-700 text-gray-600 text-sm font-bold shadow-lg">
              {currentStep + 1}
            </span>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Create New Product
              </h3>
              <p className="text-sm text-gray-500">
                Fill details, variants, and review before publishing
              </p>
            </div>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {["General Info", "Variants & Specs", "Review"].map(
              (label, index) => (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        index < currentStep
                          ? "bg-green-600 text-white shadow-lg"
                          : index === currentStep
                          ? "bg-blue-600 text-white shadow-lg ring-4 ring-blue-200"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-semibold transition-colors ${
                        index <= currentStep ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {index < totalSteps - 1 && (
                    <div className="flex-1 h-1 mx-4 bg-gray-200 rounded-full">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          index < currentStep ? "bg-green-600" : "bg-gray-200"
                        }`}
                        style={{ width: index < currentStep ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {createProductMutation.isError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800">
                Error Creating Product
              </h4>
              <p className="text-sm text-red-700 mt-1">
                {axios.isAxiosError(createProductMutation.error)
                  ? createProductMutation.error?.response?.data?.message
                  : "Failed to create product. Please try again."}
              </p>
            </div>
          </div>
        )}

        {Object.keys(formState.errors).length > 0 && formState.isSubmitted && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800">
                Validation Errors
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                Please fix the errors highlighted in the form before submitting.
              </p>
            </div>
          </div>
        )}

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && currentStep !== totalSteps - 1) {
                e.preventDefault();
              }
            }}
            className="space-y-6"
          >
            {/* Step Rendering */}
            {currentStep === 0 && (<StepGeneral />)}
            {currentStep === 1 && <StepVariantsSpecs />}
            {currentStep === 2 && <StepReview />}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200 mt-8">
              <Button
                color="gray"
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-2.5 font-semibold"
              >
                ← Back
              </Button>

              <div className="text-sm text-gray-500 font-medium">
                Step {currentStep + 1} of {totalSteps}
              </div>

              {currentStep === totalSteps - 1 ? (
                <Button
                  color="green"
                  type="submit"
                  disabled={createProductMutation.isPending}
                  className="px-6 py-2.5 font-semibold"
                >
                  {createProductMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" /> Creating Product...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Submit Product
                    </div>
                  )}
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Step →
                </button>
              )}
            </div>
          </form>
        </FormProvider>

        {/* Loading overlay while saving */}
        {(createProductMutation.isPending || updateProductMutation.isPending) && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-50">
            <Spinner size="xl" />
            <p className="mt-4 text-gray-700 font-semibold">
              Creating your product...
            </p>
            <p className="text-sm text-gray-500 mt-1">Please wait</p>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
