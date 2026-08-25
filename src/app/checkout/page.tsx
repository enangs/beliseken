"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Truck, CreditCard, CheckCircle, ChevronRight, Package, ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { createOrder } from "@/lib/orders-api";
import { PROVINCES, CITIES, STORE_ORIGIN, type OrderAddress, type ShippingOption } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { storeInfo } from "@/data/products";
import { getCurrentUser, getDefaultAddress, saveUserAddress } from "@/lib/auth-api";

type Step = 1 | 2 | 3;

const steps = [
  { id: 1, label: "Alamat", icon: MapPin },
  { id: 2, label: "Pengiriman", icon: Truck },
  { id: 3, label: "Pembayaran", icon: CreditCard },
];

const paymentMethods = [
  { id: "bank_transfer", label: "Transfer Bank (BCA/Mandiri/BNI)", description: "Transfer manual ke rekening toko" },
  { id: "ewallet", label: "E-Wallet (GoPay/OVO/DANA)", description: "Bayar via aplikasi e-wallet" },
  { id: "cod", label: "Bayar di Tempat (COD)", description: "Bayar saat barang diterima" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [address, setAddress] = useState<OrderAddress>(() => {
    // Auto-fill from logged-in user's default address
    const defaultAddr = getDefaultAddress();
    const user = getCurrentUser();
    if (defaultAddr) {
      return {
        name: user?.name || defaultAddr.name,
        phone: defaultAddr.phone,
        email: user?.email || "",
        address: defaultAddr.address,
        city: defaultAddr.city,
        cityId: defaultAddr.cityId,
        district: "",
        districtId: "",
        province: defaultAddr.province || "JAWA BARAT",
        provinceId: defaultAddr.provinceId || "6",
        postcode: defaultAddr.postcode || "17510",
      };
    }
    // Auto-fill basic info from user profile
    return {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: "",
      city: "",
      cityId: "",
      district: "",
      districtId: "",
      province: "JAWA BARAT",
      provinceId: "6",
      postcode: "17510",
    };
  });

  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [saveAddress, setSaveAddress] = useState(false);

  // Calculate shipping when city changes
  useEffect(() => {
    if (!address.cityId) return;

    const calcShipping = async () => {
      setShippingLoading(true);
      try {
        const res = await fetch("/api/shipping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin: STORE_ORIGIN,
            destination: address.cityId,
            weight: items.reduce((total, item) => total + (item.product.weight || 500) * item.quantity, 0),
            courier: "jne:sicepat:jnt:pos:tiki",
          }),
        });
        const data = await res.json();

        if (data.data) {
          const options: ShippingOption[] = [];
          for (const courier of data.data) {
            for (const cost of courier.costs) {
              options.push({
                courier: courier.name,
                service: cost.service,
                description: cost.description,
                cost: cost.cost[0].value,
                etd: cost.cost[0].etd || "1-3 hari",
              });
            }
          }
          setShippingOptions(options.sort((a, b) => a.cost - b.cost));
          if (options.length > 0) setSelectedShipping(options[0]);
        } else {
          // Fallback for demo / sandbox
          setShippingOptions([
            { courier: "JNE", service: "REG", description: "Reguler 2-4 hari", cost: 15000, etd: "2-4 hari" },
            { courier: "JNE", service: "YES", description: "Yakin Sampai Esok", cost: 25000, etd: "1-2 hari" },
            { courier: "SiCepat", service: "REG", description: "Reguler 2-3 hari", cost: 12000, etd: "2-3 hari" },
            { courier: "J&T", service: "EZ", description: "Express 1-3 hari", cost: 14000, etd: "1-3 hari" },
            { courier: "POS", service: "Paket Kilat", description: "Kilat 2-3 hari", cost: 16000, etd: "2-3 hari" },
          ]);
          setSelectedShipping({ courier: "SiCepat", service: "REG", description: "Reguler 2-3 hari", cost: 12000, etd: "2-3 hari" });
        }
      } catch {
        // Fallback
        setShippingOptions([
          { courier: "JNE", service: "REG", description: "Reguler 2-4 hari", cost: 15000, etd: "2-4 hari" },
          { courier: "SiCepat", service: "REG", description: "Reguler 2-3 hari", cost: 12000, etd: "2-3 hari" },
          { courier: "J&T", service: "EZ", description: "Express 1-3 hari", cost: 14000, etd: "1-3 hari" },
        ]);
        setSelectedShipping({ courier: "SiCepat", service: "REG", description: "Reguler 2-3 hari", cost: 12000, etd: "2-3 hari" });
      }
      setShippingLoading(false);
    };

    calcShipping();
  }, [address.cityId]);

  if (items.length === 0 && !orderPlaced) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-20 min-h-screen bg-brand-gray">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mx-auto text-brand-muted"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
            <h1 className="text-2xl font-bold text-brand-navy mb-2">Keranjang Kosong</h1>
            <p className="text-brand-muted mb-6">Tambahkan produk ke keranjang terlebih dahulu.</p>
            <Link href="/products" className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors">
              Mulai Belanja
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (orderPlaced) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-20 min-h-screen bg-brand-gray">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-brand-navy mb-2">Pesanan Berhasil!</h1>
            <p className="text-brand-muted mb-4">Terima kasih sudah berbelanja di BeliSeken.com</p>
            <div className="bg-white rounded-xl border border-brand-border p-6 mb-6 text-left">
              <p className="text-sm text-brand-muted mb-1">Nomor Pesanan</p>
              <p className="text-xl font-bold text-brand">{orderId}</p>
            </div>
            <p className="text-sm text-brand-muted mb-6">
              {paymentMethod === "cod"
                ? "Pesanan Anda sedang diproses. Pembayaran dilakukan saat barang diterima."
                : "Silakan lakukan pembayaran sesuai instruksi yang dikirim ke WhatsApp Anda."}
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard/orders" className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors">
                Lihat Pesanan
              </Link>
              <Link href="/" className="px-6 py-3 border border-brand-border text-brand-navy font-semibold rounded-xl hover:bg-white transition-colors">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const shippingCost = selectedShipping?.cost || 0;
  const total = totalPrice + shippingCost;

  const handlePlaceOrder = async () => {
    setLoading(true);

    const user = getCurrentUser();
    
    const order = await createOrder({
      items: items.map(item => ({
        productName: item.product.name,
        productSlug: item.product.slug,
        productImage: item.product.imageBase64,
        price: item.product.price,
        quantity: item.quantity,
      })),
      address,
      shipping: selectedShipping!,
      paymentMethod,
      userId: user?.id,
    });

    // Save address if checkbox is checked
    if (saveAddress && address.name && address.phone && address.address) {
      try {
        if (user) {
          saveUserAddress({
            label: "Alamat Utama",
            name: address.name,
            phone: address.phone,
            address: address.address,
            city: address.city,
            cityId: address.cityId,
            province: address.province,
            provinceId: address.provinceId,
            postcode: address.postcode,
            isDefault: true,
          });
        }
      } catch {}
    }

    clearCart();
    setOrderId(order?.orderNumber || 'BS-UNKNOWN');
    setOrderPlaced(true);
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 min-h-screen bg-brand-gray">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-brand-muted mb-6">
            <Link href="/" className="hover:text-brand">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/dashboard/cart" className="hover:text-brand">Keranjang</Link>
            <ChevronRight size={14} />
            <span className="text-brand-navy font-medium">Checkout</span>
          </nav>

          <h1 className="text-2xl font-bold text-brand-navy mb-6">Checkout</h1>

          {/* Steps */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  step >= s.id ? "bg-brand text-white" : "bg-brand-gray text-brand-muted border border-brand-border"
                }`}>
                  {step > s.id ? <CheckCircle size={16} /> : s.id}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step >= s.id ? "text-brand-navy" : "text-brand-muted"}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${step > s.id ? "bg-brand" : "bg-brand-border"}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Address */}
              {step === 1 && (
                <div className="bg-white rounded-xl border border-brand-border p-6">
                  <h2 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-brand" />
                    Alamat Pengiriman
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-brand-navy block mb-1">Nama Lengkap *</label>
                      <input type="text" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="Nama penerima" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-brand-navy block mb-1">No. WhatsApp *</label>
                      <input type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="08XXXXXXXXXX" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-semibold text-brand-navy block mb-1">Email</label>
                      <input type="email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} placeholder="email@contoh.com" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-brand-navy block mb-1">Provinsi *</label>
                      <select value={address.provinceId} onChange={(e) => {
                        const prov = PROVINCES.find((p) => p.id === e.target.value);
                        setAddress({ ...address, provinceId: e.target.value, province: prov?.name || "", cityId: "", city: "" });
                      }} className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand bg-white">
                        <option value="">Pilih Provinsi</option>
                        {PROVINCES.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-brand-navy block mb-1">Kota/Kabupaten *</label>
                      <select value={address.cityId} onChange={(e) => {
                        const cities = CITIES[address.provinceId] || [];
                        const city = cities.find((c) => c.id === e.target.value);
                        setAddress({ ...address, cityId: e.target.value, city: city?.name || "" });
                      }} className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand bg-white" disabled={!address.provinceId}>
                        <option value="">Pilih Kota</option>
                        {(CITIES[address.provinceId] || []).map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-semibold text-brand-navy block mb-1">Alamat Lengkap *</label>
                      <textarea value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} rows={3} placeholder="Jalan, nomor rumah, RT/RW, kelurahan..." className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand resize-none" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-brand-navy block mb-1">Kode Pos</label>
                      <input type="text" value={address.postcode} onChange={(e) => setAddress({ ...address, postcode: e.target.value })} placeholder="17510" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" />
                    </div>
                  </div>
                  {getCurrentUser() && (
                    <div className="mt-4 p-3 bg-brand/5 rounded-xl flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="saveAddress"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="w-4 h-4 accent-brand rounded"
                      />
                      <label htmlFor="saveAddress" className="text-sm text-brand-navy">
                        Simpan alamat ini untuk pembelian berikutnya
                      </label>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <button onClick={() => setStep(2)} disabled={!address.name || !address.phone || !address.cityId || !address.address} className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Lanjut ke Pengiriman →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div className="bg-white rounded-xl border border-brand-border p-6">
                  <h2 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
                    <Truck size={18} className="text-brand" />
                    Pilih Pengiriman
                  </h2>
                  <p className="text-sm text-brand-muted mb-4">
                    Kirim dari: <span className="font-semibold">{storeInfo.address}</span>
                    <br />
                    Kirim ke: <span className="font-semibold">{address.address}, {address.city}</span>
                  </p>

                  {shippingLoading ? (
                    <div className="text-center py-8">
                      <Loader2 size={24} className="animate-spin text-brand mx-auto mb-2" />
                      <p className="text-sm text-brand-muted">Menghitung ongkir...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {shippingOptions.map((opt, idx) => (
                        <label key={idx} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedShipping?.courier === opt.courier && selectedShipping?.service === opt.service
                            ? "border-brand bg-brand/5"
                            : "border-brand-border hover:border-brand/50"
                        }`}>
                          <input type="radio" name="shipping" checked={selectedShipping?.courier === opt.courier && selectedShipping?.service === opt.service} onChange={() => setSelectedShipping(opt)} className="accent-brand" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-brand-navy text-sm">{opt.courier}</span>
                              <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded font-semibold">{opt.service}</span>
                            </div>
                            <p className="text-xs text-brand-muted mt-0.5">{opt.description}</p>
                            <p className="text-xs text-brand-muted">Estimasi: {opt.etd}</p>
                          </div>
                          <span className="font-bold text-brand text-sm">{formatPrice(opt.cost)}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-brand-border text-brand-navy font-semibold rounded-xl text-sm hover:bg-brand-gray transition-colors">
                      ← Kembali
                    </button>
                    <button onClick={() => setStep(3)} disabled={!selectedShipping} className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50">
                      Lanjut ke Pembayaran →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="bg-white rounded-xl border border-brand-border p-6">
                  <h2 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
                    <CreditCard size={18} className="text-brand" />
                    Metode Pembayaran
                  </h2>
                  <div className="space-y-3 mb-6">
                    {paymentMethods.map((pm) => (
                      <label key={pm.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === pm.id ? "border-brand bg-brand/5" : "border-brand-border hover:border-brand/50"
                      }`}>
                        <input type="radio" name="payment" checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="accent-brand" />
                        <span className="text-2xl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-brand"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span>
                        <div className="flex-1">
                          <p className="font-semibold text-brand-navy text-sm">{pm.label}</p>
                          <p className="text-xs text-brand-muted">{pm.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button onClick={() => setStep(2)} className="px-6 py-2.5 border border-brand-border text-brand-navy font-semibold rounded-xl text-sm hover:bg-brand-gray transition-colors">
                      ← Kembali
                    </button>
                    <button onClick={handlePlaceOrder} disabled={loading} className="px-8 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          Bayar & Pesan via WhatsApp
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-brand-border p-5 sticky top-24">
                <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
                  <Package size={16} />
                  Ringkasan Pesanan
                </h3>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-brand-gray rounded-lg flex items-center justify-center flex-shrink-0 text-xs">
                        {quantity}×
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-brand-navy line-clamp-1">{product.name}</p>
                        <p className="text-xs text-brand-muted">{formatPrice(product.price)}</p>
                      </div>
                      <p className="text-xs font-semibold text-brand-navy">{formatPrice(product.price * quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Subtotal</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Pengiriman ({selectedShipping?.courier} {selectedShipping?.service})</span>
                    <span className="font-medium">{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold text-brand-navy">Total</span>
                    <span className="text-lg font-extrabold text-brand">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
