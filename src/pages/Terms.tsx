import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-peoplebook-text mb-4">Terms of Service</h1>
            <p className="text-xl text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-peoplebook-text mb-4">Acceptance of Terms</h2>
              <p className="text-slate-600 mb-4">
                By accessing and using Peoplebook.ai, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-peoplebook-text mb-4">Use License</h2>
              <p className="text-slate-600 mb-4">
                Permission is granted to temporarily access Peoplebook.ai for personal, non-commercial transitory viewing only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-peoplebook-text mb-4">User Accounts</h2>
              <p className="text-slate-600 mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                You are responsible for safeguarding your account password and for all activities under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-peoplebook-text mb-4">AI-Powered Matching</h2>
              <p className="text-slate-600 mb-4">
                Our AI matching system is designed to connect users based on compatibility, expertise, and needs. 
                While we strive for accuracy, we cannot guarantee the success of any collaboration or match.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-peoplebook-text mb-4">Contact Information</h2>
              <p className="text-slate-600">
                If you have any questions about these Terms of Service, please contact us at legal@peoplebook.ai
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;