"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface CustomerProfile {
  email: string;
  name: string | null;
  building_number: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  phone_number: string | null;
  passport_number: string | null;
  passport_expiration: string | null;
  passport_country: string | null;
  date_of_birth: string | null;
}

export default function ProfilePage() {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load customer data
  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        setError("Not signed in");
        setLoading(false);
        return;
      }

      const email = session.user.email;

      const { data, error } = await supabase
        .from("customer")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setCustomer(data);
      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!customer) return;

    setSaving(true);
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("customer")
      .update({
        name: customer.name,
        building_number: customer.building_number,
        street: customer.street,
        city: customer.city,
        state: customer.state,
        phone_number: customer.phone_number,
        passport_number: customer.passport_number,
        passport_expiration: customer.passport_expiration,
        passport_country: customer.passport_country,
        date_of_birth: customer.date_of_birth,
      })
      .eq("email", customer.email);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Profile updated successfully.");
    }

    setSaving(false);
  };

  const updateField = (field: keyof CustomerProfile, value: string | null) => {
    if (!customer) return;
    setCustomer({ ...customer, [field]: value });
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
  }

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!customer) return <div className="p-6">No profile found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-xl p-8 border border-gray-200">
          <h1 className="text-center text-4xl font-bold text-gray-800 mb-8">
            Profile Settings
          </h1>

          {success && (
            <p className="text-green-600 font-medium mb-4 bg-green-50 p-3 rounded-lg border border-green-200">
              {success}
            </p>
          )}
          {error && (
            <p className="text-red-600 font-medium mb-4 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          {/* ---------- Profile Fields ---------- */}
          <div className="space-y-6">
            <Section title="Account">
              <Field label="Email">
                <input
                  type="text"
                  value={customer.email}
                  disabled
                  className="w-full border p-3 rounded-lg bg-gray-100 text-gray-600"
                />
              </Field>

              <Field label="Name">
                <input
                  type="text"
                  value={customer.name || ""}
                  onChange={(e) => updateField("name", e.target.value || null)}
                  className="input"
                />
              </Field>
            </Section>

            <Section title="Address">
              <Field label="Building Number">
                <input
                  type="text"
                  value={customer.building_number || ""}
                  onChange={(e) =>
                    updateField("building_number", e.target.value || null)
                  }
                  className="input"
                />
              </Field>

              <Field label="Street">
                <input
                  type="text"
                  value={customer.street || ""}
                  onChange={(e) =>
                    updateField("street", e.target.value || null)
                  }
                  className="input"
                />
              </Field>

              <Field label="City">
                <input
                  type="text"
                  value={customer.city || ""}
                  onChange={(e) => updateField("city", e.target.value || null)}
                  className="input"
                />
              </Field>

              <Field label="State">
                <input
                  type="text"
                  value={customer.state || ""}
                  onChange={(e) => updateField("state", e.target.value || null)}
                  className="input"
                />
              </Field>
            </Section>

            <Section title="Contact">
              <Field label="Phone Number">
                <input
                  type="text"
                  value={customer.phone_number || ""}
                  onChange={(e) =>
                    updateField("phone_number", e.target.value || null)
                  }
                  className="input"
                />
              </Field>
            </Section>

            <Section title="Passport Info">
              <Field label="Passport Number">
                <input
                  type="text"
                  value={customer.passport_number || ""}
                  onChange={(e) =>
                    updateField("passport_number", e.target.value || null)
                  }
                  className="input"
                />
              </Field>

              <Field label="Passport Expiration">
                <input
                  type="date"
                  value={customer.passport_expiration || ""}
                  onChange={(e) =>
                    updateField("passport_expiration", e.target.value || null)
                  }
                  className="input"
                />
              </Field>

              <Field label="Passport Country">
                <input
                  type="text"
                  value={customer.passport_country || ""}
                  onChange={(e) =>
                    updateField("passport_country", e.target.value || null)
                  }
                  className="input"
                />
              </Field>
            </Section>

            <Section title="Personal">
              <Field label="Date of Birth">
                <input
                  type="date"
                  value={customer.date_of_birth || ""}
                  onChange={(e) =>
                    updateField("date_of_birth", e.target.value || null)
                  }
                  className="input"
                />
              </Field>
            </Section>
          </div>

          {/* ---------- Save Button ---------- */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer mt-10 w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <Link
            href = "/"
            onClick={handleSignOut}
            className="cursor-pointer mt-3 w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
          >
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {children}
    </div>
  );
}

