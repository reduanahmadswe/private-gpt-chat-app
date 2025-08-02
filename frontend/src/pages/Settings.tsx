import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, User, Lock, Crown } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Settings: React.FC = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await axios.patch('/api/user/update', profileData)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setLoading(true)
    
    try {
      await axios.patch('/api/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      toast.success('Password changed successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/dashboard"
            className="mr-4 p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="flex border-b border-white/20 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-white'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>
            
            <button
              onClick={() => setActiveTab('password')}
              className={`flex items-center space-x-2 px-4 py-2 ml-6 font-medium border-b-2 transition-colors ${
                activeTab === 'password'
                  ? 'border-primary-500 text-white'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Password</span>
            </button>
            
            <button
              onClick={() => setActiveTab('upgrade')}
              className={`flex items-center space-x-2 px-4 py-2 ml-6 font-medium border-b-2 transition-colors ${
                activeTab === 'upgrade'
                  ? 'border-primary-500 text-white'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              <Crown className="h-4 w-4" />
              <span>Upgrade</span>
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="input-field"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="input-field"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}

          {/* Upgrade Tab */}
          {activeTab === 'upgrade' && (
            <div className="text-center py-12">
              <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-4">Upgrade Your Experience</h2>
              <p className="text-white/70 mb-8">
                Get access to premium features and enhanced AI capabilities.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Basic</h3>
                  <p className="text-white/70 text-sm mb-4">Current Plan</p>
                  <p className="text-white/50">Limited conversations</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-6 border border-yellow-400/30">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">Pro</h3>
                  <p className="text-white/70 text-sm mb-4">$9.99/month</p>
                  <p className="text-white/50">Unlimited conversations</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Enterprise</h3>
                  <p className="text-white/70 text-sm mb-4">$29.99/month</p>
                  <p className="text-white/50">Advanced features</p>
                </div>
              </div>
              
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Coming Soon</h3>
                <p className="text-white/70">
                  We're working hard to bring you premium features. Stay tuned for updates!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
