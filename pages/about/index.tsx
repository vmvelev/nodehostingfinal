import { AboutCards } from "@/components/ui/about-cards";
import { NavBar } from "@/components/ui/navbar";

export default function About() {
  return (
    <div className="w-full">
      <section className="w-full relative bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
        <div className="flex flex-col min-h-[100vh]">
          <NavBar />
          <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 text-gray-50">
              <div className="container grid items-center justify-center gap-4 px-4 md:px-6 lg:gap-10">
                <div className="space-y-3 text-center">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    About DeNodeHost
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    DeNodeHost is a FLUX node hosting solution with your privacy
                    in mind. We provide a secure and reliable platform for
                    hosting your nodes without sharing any personal information.
                  </p>
                </div>
                <div className="mx-auto px-3 py-3 rounded-lg grid max-w-4xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 bg-black bg-opacity-70">
                  <AboutCards
                    name="Payments in FLUX"
                    body="As we have your privacy in mind, we only accept payments in FLUX. This ensures your transactions are secure and anonymous."
                  />
                  <AboutCards
                    name="FLUX 90%"
                    body="We have designed our platform to be 90% powered by FLUX.
                      We believe in the future of FLUX and want to support the
                      network. We are working hard to make this a 100% FLUX
                      powered platform."
                  />
                  <AboutCards
                    name="Monitoring"
                    body="Monitor the health and performance of your nodes in real
                      time with our advanced monitoring tools."
                  />
                  <AboutCards
                    name="Cookies"
                    body="Expect to see only one cookie on our website. This cookie
                      is used to store your session information and is deleted
                      every 7 days."
                  />
                  <AboutCards
                    name="No ads"
                    body="We will never place ads on our website. We value your
                      privacy and want to provide you with the best experience
                      possible."
                  />
                  <AboutCards
                    name="No trackers"
                    body="We do not use any trackers on our website. Your privacy is
                      our top priority."
                  />
                </div>
              </div>
            </section>
          </main>
        </div>
      </section>
    </div>
  );
}
