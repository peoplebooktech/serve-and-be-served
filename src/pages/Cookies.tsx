import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-peoplebook-text mb-4">Cookie Policy</h1>
            <p className="text-xl text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-peoplebook-text mb-4">What Are Cookies</h2>
              <p className="text-slate-600 mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-peoplebook-text mb-4">How We Use Cookies</h2>
              <p className="text-slate-600 mb-4">
                Peoplebook.ai uses cookies for several purposes:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Authentication Cookies:</strong> To keep you logged in and maintain your session</li>
                <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
                <li><strong>Analytics Cookies:</strong> To understand how you use our website and improve our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-peoplebook-text mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-peoplebook-text">Session Cookies</h3>
                  <p className="text-slate-600">These are temporary cookies that expire when you close your browser.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-peoplebook-text">Persistent Cookies</h3>
                  <p className="text-slate-600">These remain on your device for a set period or until you delete them.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-peoplebook-text mb-4">Managing Cookies</h2>
              <p className="text-slate-600 mb-4">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer 
                and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually 
                adjust some preferences every time you visit a site and some services and features may not function.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-peoplebook-text mb-4">Contact Us</h2>
              <p className="text-slate-600">
                If you have any questions about our use of cookies, please contact us at cookies@peoplebook.ai
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cookies;