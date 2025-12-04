"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

interface AirlineStaffProfile {
  username: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  email_address: string | null;
  airline_name: string | null;
  phone_number: string | null;
}

type Profile =
  | ({ role: "customer" } & CustomerProfile)
  | ({ role: "staff" } & AirlineStaffProfile);

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // load profile for both staff/customer
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

      // Try loading customer data
      const { data: cust } = await supabase
        .from("customer")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (cust) {
        setProfile({ role: "customer", ...cust });
        setLoading(false);
        return;
      }

      // if loading customer failed, try loading staff data
      const { data: staff } = await supabase
        .from("airline_staff")
        .select("*")
        .eq("email_address", email)
        .maybeSingle();

      if (staff) {
        setProfile({ role: "staff", ...staff });
        setLoading(false);
        return;
      }

      // else error
      setError("Profile not found.");
      setLoading(false);
    };

    loadProfile();
  }, []);

  // generic field updater 
  const updateField = (
    field: keyof CustomerProfile | keyof AirlineStaffProfile,
    value: string | null
  ) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  // save profile (handles both roles)
  const handleSave = async () => {
    if (!profile) return;

    setError("");
    setSuccess("");
    setSaving(true);

    if (profile.role === "customer") {
      const { error: customerError } = await supabase
        .from("customer")
        .update({
          name: profile.name,
          building_number: profile.building_number,
          street: profile.street,
          city: profile.city,
          state: profile.state,
          phone_number: profile.phone_number,
          passport_number: profile.passport_number,
          passport_expiration: profile.passport_expiration,
          passport_country: profile.passport_country,
          date_of_birth: profile.date_of_birth,
        })
        .eq("email", profile.email);

      if (customerError) setError(customerError.message);
      else setSuccess("Profile updated successfully.");
    }

    if (profile.role === "staff") {
      let errorFound = false; // need to track because inserting into 2 tables

      const { error: staffError } = await supabase
        .from("airline_staff")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email_address: profile.email_address,
          airline_name: profile.airline_name,
          date_of_birth: profile.date_of_birth,
        })
        .eq("username", profile.username);
      
      if (staffError) {
        setError(staffError.message);
        errorFound = true;
        setSaving(false);
        return;
      }

      const { error: phoneError } = await supabase
        .from("phone_numbers")
        .insert({
          username: profile.username,
          phone_number: profile.phone_number
        });
      
      if (phoneError) {
        setError(`Phone insert failed: ${phoneError.message}`);
        errorFound = true;
      }

      // show success if no errors found when inserting into both tables
      if (!errorFound) {
        setSuccess("Profile updated successfully.");
      }
    }

    setSaving(false);
  };

  // sign out upon clicking sign out button
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // redirects to login page
    router.refresh();      // clears any cached data
  };

  // ui states
  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!profile) return <div className="p-6">No profile found.</div>;

  // profile page rendering
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-xl p-8 border border-gray-200">
          <h1 className="text-center text-4xl font-bold text-gray-800 mb-8">
            Profile Settings
          </h1>

          {success && (
            <p className="text-green-600 mb-4 bg-green-50 p-3 rounded-lg border border-green-200">
              {success}
            </p>
          )}
          {error && (
            <p className="text-red-600 mb-4 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          <div className="space-y-6">

            {/* Account Information*/}
            <Section title="Account">
              <Field label={profile.role === "customer" ? "Email" : "Username"}>
                <input
                  type="text"
                  value={
                    profile.role === "customer"
                      ? profile.email
                      : profile.username
                  }
                  disabled
                  className="w-full border p-3 rounded-lg bg-gray-100 text-gray-600"
                />
              </Field>

              {profile.role === "customer" && (
                <Field label="Name">
                  <input
                    type="text"
                    value={profile.name || ""}
                    onChange={(e) =>
                      updateField("name", e.target.value || null)
                    }
                    className="input"
                  />
                </Field>
              )}

              {profile.role === "staff" && (
                <>
                  <Field label="First Name">
                    <input
                      type="text"
                      value={profile.first_name || ""}
                      onChange={(e) =>
                        updateField("first_name", e.target.value || null)
                      }
                      className="input"
                    />
                  </Field>

                  <Field label="Last Name">
                    <input
                      type="text"
                      value={profile.last_name || ""}
                      onChange={(e) =>
                        updateField("last_name", e.target.value || null)
                      }
                      className="input"
                    />
                  </Field>
                </>
              )}
            </Section>

            {/* Address (customer only) */}
            {profile.role === "customer" && (
              <>
                <Section title="Address">
                  <Field label="Building Number">
                    <input
                      className="input"
                      value={profile.building_number || ""}
                      onChange={(e) =>
                        updateField("building_number", e.target.value || null)
                      }
                    />
                  </Field>

                  <Field label="Street">
                    <input
                      className="input"
                      value={profile.street || ""}
                      onChange={(e) =>
                        updateField("street", e.target.value || null)
                      }
                    />
                  </Field>

                  <Field label="City">
                    <input
                      className="input"
                      value={profile.city || ""}
                      onChange={(e) =>
                        updateField("city", e.target.value || null)
                      }
                    />
                  </Field>

                  <Field label="State">
                    <input
                      className="input"
                      value={profile.state || ""}
                      onChange={(e) =>
                        updateField("state", e.target.value || null)
                      }
                    />
                  </Field>
                </Section>

                <Section title="Contact">
                  <Field label="Phone Number">
                    <input
                      className="input"
                      value={profile.phone_number || ""}
                      onChange={(e) =>
                        updateField("phone_number", e.target.value || null)
                      }
                    />
                  </Field>
                </Section>

                <Section title="Passport Info">
                  <Field label="Passport Number">
                    <input
                      className="input"
                      value={profile.passport_number || ""}
                      onChange={(e) =>
                        updateField("passport_number", e.target.value || null)
                      }
                    />
                  </Field>

                  <Field label="Passport Expiration">
                    <input
                      type="date"
                      className="input"
                      value={profile.passport_expiration || ""}
                      onChange={(e) =>
                        updateField(
                          "passport_expiration",
                          e.target.value || null
                        )
                      }
                    />
                  </Field>

                  <Field label="Passport Country">
                    <input
                      className="input"
                      value={profile.passport_country || ""}
                      onChange={(e) =>
                        updateField("passport_country", e.target.value || null)
                      }
                    />
                  </Field>
                </Section>
              </>
            )}

            {/* Personal Info Section */}
            <Section title="Personal">
              <Field label="Date of Birth">
                <input
                  type="date"
                  className="input"
                  value={profile.date_of_birth || ""}
                  onChange={(e) =>
                    updateField("date_of_birth", e.target.value || null)
                  }
                />
              </Field>

              {profile.role === "staff" && (
                <>
                <Field label="Airline Name">
                  <input
                    className="input"
                    value={profile.airline_name || ""}
                    onChange={(e) =>
                      updateField("airline_name", e.target.value || null)
                    }
                  />
                </Field>
                <Field label="Add Phone Number">
                  <input
                    className="input"
                    value={profile.phone_number || ""}
                    onChange={(e) =>
                      updateField("phone_number", e.target.value || null)
                    }
                  />
                </Field>
                </>
              )}
            </Section>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer mt-10 w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {/* Home Button */}
          <Link
            className="block text-center mt-4 cursor-pointer w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
            href="/"
          >
            Back to Home
          </Link>

          {/* Sign Out Button */}
          <button
            className="block text-center mt-4 cursor-pointer w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
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
