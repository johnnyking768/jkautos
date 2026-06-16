import { useState } from "react";
import ImageUploader from "../../components/ui/ImageUploader";
import { useAuth } from "../../hooks/useAuth";

export default function UserProfile() {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState(user?.profile_image ? [user.profile_image] : []);

  return (
    <div>
      <p className="eyebrow">Account</p><h1 className="page-title">Profile</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="glass-dark p-5"><ImageUploader value={avatar} onChange={setAvatar} /><p className="mt-4 text-sm text-zinc-500">Avatar upload uses the profile-images bucket when Supabase is configured.</p></div>
        <form className="glass-dark grid gap-4 p-5 md:grid-cols-2">
          <input className="input" defaultValue={user?.name} placeholder="Name" />
          <input className="input" defaultValue={user?.email} placeholder="Email" disabled />
          <input className="input" defaultValue={user?.phone} placeholder="Phone" />
          <input className="input" defaultValue={user?.city} placeholder="City" />
          <input className="input" defaultValue={user?.country || "Nigeria"} placeholder="Country" />
          <input className="input" type="password" placeholder="New password" />
          <p className="text-sm text-zinc-500 md:col-span-2">Role: {user?.role} / Joined: {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
          <button className="primary-btn md:col-span-2" type="button">Save Profile</button>
        </form>
      </div>
    </div>
  );
}
