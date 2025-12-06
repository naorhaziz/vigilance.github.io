import { Settings, Bell, Shield, Zap, Globe, User, Lock } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    critical: true,
    high: true,
    medium: false,
    low: false,
  });

  const [autoResponse, setAutoResponse] = useState(false);
  const [viralityThreshold, setViralityThreshold] = useState(85);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Settings className="w-10 h-10 text-blue-500" />
          Settings
        </h1>
        <p className="text-gray-400">Configure your threat detection and monitoring preferences</p>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Notifications</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value], i) => (
              <div key={key} className="flex items-center justify-between p-4 glass-hover rounded-lg">
                <div>
                  <div className="font-semibold capitalize">{key} Threats</div>
                  <div className="text-sm text-gray-400">Get notified about {key} severity threats</div>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !value })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      value ? 'translate-x-7' : ''
                    }`}
                  ></div>
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Detection Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold">Detection Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Virality Threshold</label>
                <span className="text-sm text-blue-400 font-semibold">{viralityThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={viralityThreshold}
                onChange={(e) => setViralityThreshold(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-sm text-gray-400 mt-1">
                Trigger alerts when content reaches this virality percentage
              </div>
            </div>

            <div className="flex items-center justify-between p-4 glass-hover rounded-lg">
              <div>
                <div className="font-semibold">Auto-Response Mode</div>
                <div className="text-sm text-gray-400">Automatically deploy AI responses for critical threats</div>
              </div>
              <button
                onClick={() => setAutoResponse(!autoResponse)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  autoResponse ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    autoResponse ? 'translate-x-7' : ''
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* AI Arsenal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">AI Arsenal</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 glass-hover rounded-lg">
              <div className="font-semibold mb-1">Content Generation</div>
              <div className="text-sm text-gray-400 mb-3">AI-powered response content quality</div>
              <select className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>High Quality (Slower)</option>
                <option>Balanced</option>
                <option>Fast (Lower Quality)</option>
              </select>
            </div>

            <div className="p-4 glass-hover rounded-lg">
              <div className="font-semibold mb-1">Response Tone</div>
              <div className="text-sm text-gray-400 mb-3">Default tone for AI-generated responses</div>
              <select className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Professional</option>
                <option>Empathetic</option>
                <option>Assertive</option>
                <option>Neutral</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold">Account</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 glass-hover rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold">Organization</div>
                <div className="text-sm text-gray-400">Israel Defense Forces</div>
              </div>
            </div>

            <div className="p-4 glass-hover rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold">Role</div>
                <div className="text-sm text-gray-400">Administrator</div>
              </div>
            </div>

            <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </button>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end gap-3"
        >
          <button className="px-6 py-3 glass-hover rounded-lg font-semibold">
            Cancel
          </button>
          <button className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-colors">
            Save Changes
          </button>
        </motion.div>
      </div>
    </div>
  );
}
