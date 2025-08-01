import Header from "@/components/Header";
import ProductForm from "@/components/ProductForm";
import AIServiceStatus from "@/components/AIServiceStatus";

const Submit = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AIServiceStatus />
        <ProductForm />
      </main>
    </div>
  );
};

export default Submit;