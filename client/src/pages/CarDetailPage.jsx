import { CalendarClock, CheckCircle2, Copy, Heart, MessageCircle, Phone, Printer, Scale, Share2, Star } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import toast from "react-hot-toast";
import Badge from "../components/ui/Badge";
import CarCard from "../components/ui/CarCard";
import Loader from "../components/ui/Loader";
import Modal from "../components/ui/Modal";
import SpecRow from "../components/ui/SpecRow";
import { CompareContext } from "../context/CompareContext";
import { useAuth } from "../hooks/useAuth";
import { carService } from "../services/carService";
import { inspectionService } from "../services/inspectionService";
import { installmentService } from "../services/installmentService";
import { messageService } from "../services/messageService";
import { savedService } from "../services/savedService";
import { testDriveService } from "../services/testDriveService";
import { viewedService } from "../services/viewedService";
import { formatMileage } from "../utils/formatMileage";
import { formatPrice } from "../utils/formatPrice";

const defaultPlans = [
  { id: "starter", name: "Starter", down_payment_percent: 30, duration_months: 12, interest_rate: 5 },
  { id: "standard", name: "Standard", down_payment_percent: 20, duration_months: 24, interest_rate: 8 },
  { id: "premium", name: "Premium", down_payment_percent: 10, duration_months: 36, interest_rate: 12 },
];

export default function CarDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCompare } = useContext(CompareContext);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbs, setThumbs] = useState(null);
  const [modal, setModal] = useState("");
  const [plans, setPlans] = useState(defaultPlans);
  const [selectedPlan, setSelectedPlan] = useState(defaultPlans[1]);
  const [downPayment, setDownPayment] = useState(0);

  useEffect(() => {
    setLoading(true);
    carService
      .getSingle(slug)
      .then((data) => {
        setDetails(data);
        document.title = `${data.car.title} | JK Autos`;
        const meta = document.querySelector("meta[name='description']") || document.createElement("meta");
        meta.setAttribute("name", "description");
        meta.setAttribute("content", `${data.car.title} for ${formatPrice(data.car.discounted_price || data.car.price)} at JK Autos.`);
        document.head.appendChild(meta);
        if (user) viewedService.add(data.car.id).catch(() => {});
      })
      .catch(() => setDetails(null))
      .finally(() => setLoading(false));
    installmentService.plans().then((data) => setPlans(data.plans || defaultPlans)).catch(() => {});
  }, [slug, user]);

  const car = details?.car;
  const price = Number(car?.discounted_price || car?.price || 0);
  const minDown = selectedPlan ? Math.round(price * (Number(selectedPlan.down_payment_percent) / 100)) : 0;
  const activeDown = Math.max(Number(downPayment || 0), minDown);
  const monthly = selectedPlan ? Math.ceil(((price - activeDown) * (1 + Number(selectedPlan.interest_rate) / 100)) / Number(selectedPlan.duration_months)) : 0;
  const schedule = useMemo(
    () => Array.from({ length: Number(selectedPlan?.duration_months || 0) }, (_, index) => ({ month: index + 1, amount: monthly })),
    [selectedPlan, monthly]
  );

  useEffect(() => {
    if (car && !downPayment) setDownPayment(minDown);
  }, [car, minDown, downPayment]);

  if (loading) return <main className="page-shell"><Loader /></main>;
  if (!car) return <main className="page-shell"><div className="empty-state"><h1>Car Not Found</h1><Link className="primary-btn" to="/cars">Back To Inventory</Link></div></main>;

  const whatsapp = `https://wa.me/2348121638903?text=${encodeURIComponent(`Hi, I'm interested in the ${car.title} listed on JK Autos for ${formatPrice(price)}`)}`;
  const jsonLd = { "@context": "https://schema.org", "@type": "Car", name: car.title, brand: car.brand, model: car.model, vehicleModelDate: car.year, mileageFromOdometer: `${car.mileage} KM`, offers: { "@type": "Offer", price, priceCurrency: "NGN", availability: car.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut" } };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied");
  };

  const saveCar = async () => {
    if (!user) return toast.error("Login to save cars");
    const data = await savedService.toggle(car.id);
    toast.success(data.saved ? "Saved to garage" : "Removed from saved cars");
  };

  const submitModal = async (event) => {
    event.preventDefault();
    if (!user && modal !== "message") return toast.error("Please log in first");
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      if (modal === "inspection") await inspectionService.create({ ...form, car_id: car.id });
      if (modal === "test") await testDriveService.create({ ...form, car_id: car.id });
      if (modal === "message") await messageService.create({ ...form, car_id: car.id, subject: form.subject || `Inquiry about ${car.title}` });
      if (modal === "installment") await installmentService.apply({ car_id: car.id, plan_id: selectedPlan.id, down_payment: activeDown });
      toast.success("Request sent to JK Autos");
      setModal("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not complete action");
    }
  };

  return (
    <main className="page-shell">
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <div className="mx-auto max-w-7xl px-4">
        <div className="breadcrumb">Home / Cars / {car.body_type?.toUpperCase()} / {car.title}</div>
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <div className="relative bg-zinc-950">
              <Swiper modules={[Navigation, Thumbs]} navigation thumbs={{ swiper: thumbs }} className="detail-swiper">
                {car.images?.map((image, index) => (
                  <SwiperSlide key={image}>
                    <button className="block h-[360px] w-full md:h-[560px]" onClick={() => setModal("gallery")}>
                      <img src={image} alt={`${car.title} ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
              <span className="absolute bottom-4 right-4 z-10 bg-black/80 px-3 py-2 font-data text-xs">{car.images?.length || 1} photos</span>
              {car.video_url && <button className="absolute left-4 top-4 z-10 bg-red-700 px-3 py-2 font-display text-xs uppercase" onClick={() => setModal("video")}>360 view</button>}
            </div>
            <Swiper modules={[Thumbs]} watchSlidesProgress onSwiper={setThumbs} slidesPerView={4} spaceBetween={10} className="mt-3">
              {car.images?.map((image) => (
                <SwiperSlide key={image}><img src={image} alt="" className="h-24 w-full cursor-pointer object-cover opacity-70 hover:opacity-100" /></SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-8">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge tone={car.condition}>{car.condition}</Badge>
                <Badge tone={car.fuel_type}>{car.fuel_type}</Badge>
                <Badge tone={car.status}>{car.status}</Badge>
                {car.is_negotiable && <Badge tone="featured">Negotiable</Badge>}
              </div>
              <h1 className="font-display text-4xl font-black uppercase md:text-6xl">{car.title}</h1>
              <p className="price-tag mt-4 text-4xl md:text-5xl">{formatPrice(price)}</p>
              {car.discounted_price && <p className="font-data text-lg text-zinc-500 line-through">{formatPrice(car.price)}</p>}
            </div>

            <section className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                ["Year", car.year],
                ["Mileage", formatMileage(car.mileage)],
                ["Transmission", car.transmission],
                ["Fuel Type", car.fuel_type],
                ["Engine", car.engine_size],
                ["Horsepower", car.horsepower],
                ["Drivetrain", car.drivetrain?.toUpperCase()],
                ["Doors", car.doors],
                ["Seats", car.seats],
                ["Color", car.color],
                ["Interior", car.interior_color],
                ["VIN", car.vin],
              ].map(([label, value]) => <div key={label} className="glass-dark p-4"><SpecRow label={label} value={value} /></div>)}
            </section>

            <section className="content-panel">
              <h2>Features</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {car.features?.map((feature) => (
                  <p key={feature} className="flex items-center gap-2 text-zinc-300"><CheckCircle2 className="h-4 w-4 text-red-500" /> {feature}</p>
                ))}
              </div>
            </section>

            <section className="content-panel">
              <h2>Description</h2>
              <p className="text-zinc-300">{car.description}</p>
              <p className="mt-4 font-data text-sm text-zinc-500">Located in: {car.location}</p>
            </section>

            {car.installment_available && (
              <section className="content-panel">
                <h2>Installment Calculator</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <select className="input" value={selectedPlan?.id} onChange={(event) => setSelectedPlan(plans.find((plan) => plan.id === event.target.value))}>
                    {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                  </select>
                  <input className="input" type="number" min={minDown} value={activeDown} onChange={(event) => setDownPayment(event.target.value)} />
                  <button className="primary-btn" onClick={() => setModal("installment")}>Apply Now</button>
                </div>
                <p className="mt-4 price-tag text-2xl">{formatPrice(monthly)} / month</p>
                <div className="mt-4 max-h-52 overflow-auto border border-white/10">
                  {schedule.slice(0, 12).map((row) => <div key={row.month} className="flex justify-between border-b border-white/10 p-3 font-data text-sm"><span>Month {row.month}</span><span>{formatPrice(row.amount)}</span></div>)}
                </div>
              </section>
            )}

            <section className="content-panel">
              <h2>Reviews</h2>
              <div className="space-y-3">
                {(details.reviews || []).map((review) => (
                  <div key={review.id} className="border border-white/10 p-4">
                    <div className="flex gap-1 text-red-500">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div>
                    <p className="mt-2 text-zinc-300">{review.comment}</p>
                    <p className="mt-2 text-sm text-zinc-500">{review.user}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="glass-dark p-5">
              <p className="price-tag text-4xl">{formatPrice(price)}</p>
              <div className="mt-5 grid gap-3">
                <button className="primary-btn h-12" onClick={() => setModal("inspection")}><CalendarClock className="h-4 w-4" /> Book Inspection</button>
                <button className="secondary-btn h-12" onClick={() => setModal("test")}><CalendarClock className="h-4 w-4" /> Schedule Test Drive</button>
                <button className="secondary-btn h-12" onClick={() => setModal("message")}><MessageCircle className="h-4 w-4" /> Send Inquiry</button>
                <button className="secondary-btn h-12" onClick={saveCar}><Heart className="h-4 w-4" /> Save Car</button>
              </div>
              <label className="mt-5 flex items-center gap-3 text-sm text-zinc-300"><input type="checkbox" onChange={() => addToCompare(car)} /> Add to compare</label>
              <div className="mt-5 flex gap-2">
                <button className="icon-btn" onClick={copyLink} aria-label="Copy link"><Copy className="h-4 w-4" /></button>
                <button className="icon-btn" onClick={() => navigator.share?.({ title: car.title, url: location.href }) || copyLink()} aria-label="Share"><Share2 className="h-4 w-4" /></button>
                <button className="icon-btn" onClick={() => window.print()} aria-label="Print"><Printer className="h-4 w-4" /></button>
              </div>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="font-display text-xl font-black">JK AUTOS</p>
                <p className="mt-2 text-sm text-zinc-400">Premium dealership, Lagos, Nigeria</p>
                <a href="tel:+2348121638903" className="primary-btn mt-4 w-full bg-emerald-700 hover:bg-emerald-600"><Phone className="h-4 w-4" /> Call Now</a>
                <a href={whatsapp} target="_blank" rel="noreferrer" className="secondary-btn mt-3 w-full border-emerald-700 text-emerald-400"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              </div>
            </div>
          </aside>
        </section>

        <section className="section px-0">
          <div className="section-heading">
            <p className="eyebrow">More options</p>
            <h2>Similar Vehicles</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {details.similar?.map((item) => <CarCard key={item.id} car={item} />)}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 border-t border-white/10 bg-black lg:hidden">
        <a className="mobile-action" href="tel:+2348121638903">Call</a>
        <a className="mobile-action" href={whatsapp}>WhatsApp</a>
        <button className="mobile-action" onClick={saveCar}>Save</button>
      </div>

      <Modal open={Boolean(modal)} title={modal === "test" ? "Schedule Test Drive" : modal === "message" ? "Send Inquiry" : modal === "gallery" ? "Gallery" : modal === "video" ? "Virtual Tour" : modal === "installment" ? "Apply For Installment" : "Book Inspection"} onClose={() => setModal("")}>
        {modal === "gallery" && <div className="grid gap-3">{car.images?.map((image) => <img key={image} src={image} alt={car.title} className="w-full" />)}</div>}
        {modal === "video" && <iframe title="Virtual tour" src={car.video_url} className="aspect-video w-full" allowFullScreen />}
        {["inspection", "test", "message", "installment"].includes(modal) && (
          <form className="space-y-4" onSubmit={submitModal}>
            {modal === "inspection" && (
              <>
                <input className="input" name="inspection_date" type="date" required />
                <input className="input" name="inspection_time" type="time" required />
                <input className="input" name="location" placeholder="Preferred location" />
              </>
            )}
            {modal === "test" && (
              <>
                <input className="input" name="drive_date" type="date" required />
                <input className="input" name="drive_time" type="time" required />
              </>
            )}
            {modal === "message" && (
              <>
                {!user && <input className="input" name="name" placeholder="Your name" required />}
                {!user && <input className="input" name="email" type="email" placeholder="Email address" required />}
                <input className="input" name="subject" placeholder="Subject" />
              </>
            )}
            {modal === "installment" && <p className="text-zinc-300">Apply for {selectedPlan?.name}: {formatPrice(activeDown)} down, {formatPrice(monthly)} monthly.</p>}
            {modal !== "installment" && <textarea className="input min-h-32" name="note" placeholder="Notes" />}
            {modal === "message" && <textarea className="input min-h-32" name="content" placeholder="Message" required />}
            <button className="primary-btn w-full">Submit</button>
          </form>
        )}
      </Modal>
    </main>
  );
}
