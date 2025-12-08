import { X, Video, FileText, Shield, Rocket, Play, Copy, Send, Loader2, Check, Clock, TrendingDown, Users, Target, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState, useMemo, useEffect } from 'react';

export default function ThreatModal() {
  const { selectedThreat, setSelectedThreat } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [fullscreenVideo, setFullscreenVideo] = useState(null);

  // Reset to overview tab when modal opens
  useEffect(() => {
    if (selectedThreat) {
      setActiveTab('overview');
    }
  }, [selectedThreat?.id]); // Reset when threat changes

  // Loading states for different actions
  const [loadingVideo, setLoadingVideo] = useState(null);
  const [loadingStatement, setLoadingStatement] = useState(null);
  const [loadingDeployment, setLoadingDeployment] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [deploymentAction, setDeploymentAction] = useState(null);

  // Calculate time decay data (effectiveness drop over time)
  const timeDecayData = useMemo(() => {
    if (!selectedThreat) return [];

    const baseEffectiveness = 100;
    // Use the threat-specific decay rate from database, or fallback to severity-based
    const decayRate = selectedThreat.effectivenessDecayPerHour
      ? selectedThreat.effectivenessDecayPerHour / 100
      : (selectedThreat.severity === 'critical' ? 0.23 :
        selectedThreat.severity === 'high' ? 0.18 : 0.12);

    return Array.from({ length: 25 }, (_, hour) => ({
      hour,
      effectiveness: Math.max(0, baseEffectiveness - (hour * decayRate * 100))
    }));
  }, [selectedThreat]);

  // Calculate arsenal metrics
  const arsenalMetrics = useMemo(() => {
    if (!selectedThreat?.aiResponses) return null;

    const { videos = [], textResponses = [], campaigns = [], attackStrategies = [] } = selectedThreat.aiResponses;

    const avgVideoEffectiveness = videos.length > 0
      ? videos.reduce((sum, v) => sum + v.estimatedEffectiveness, 0) / videos.length
      : 0;

    const avgTextEffectiveness = textResponses.length > 0
      ? textResponses.reduce((sum, t) => sum + t.estimatedEffectiveness, 0) / textResponses.length
      : 0;

    const totalReach = [
      ...videos.map(v => v.estimatedReach || 0),
      ...textResponses.map(t => t.estimatedReach || 0)
    ].reduce((sum, r) => sum + r, 0);

    return {
      totalAssets: videos.length + textResponses.length + campaigns.length + attackStrategies.length,
      videoCount: videos.length,
      textCount: textResponses.length,
      campaignCount: campaigns.length,
      avgVideoEffectiveness: Math.round(avgVideoEffectiveness),
      avgTextEffectiveness: Math.round(avgTextEffectiveness),
      totalReach: totalReach
    };
  }, [selectedThreat]);

  // Handle video preview/deploy
  const handleVideoAction = async (videoId) => {
    setLoadingVideo(videoId);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    setLoadingVideo(null);
  };

  // Handle copy action
  const handleCopy = async (stmtId, content) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(stmtId);
    setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
  };

  // Handle statement queue
  const handleQueueStatement = async (stmtId) => {
    setLoadingStatement(stmtId);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setLoadingStatement(null);
  };

  // Handle deployment actions
  const handleDeploymentAction = async (action) => {
    setDeploymentAction(action);
    setLoadingDeployment(true);
    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate API call
    setLoadingDeployment(false);
    setDeploymentAction(null);
  };

  if (!selectedThreat) return null;

  const threat = selectedThreat;
  const arsenal = threat.aiResponses || {};
  const redTeam = threat.redTeamAnalysis || {};
  const distributionPlan = threat.distributionPlan || {};

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={() => setSelectedThreat(null)}
    >
      <div className="bg-slate-950/95 max-w-7xl w-full max-h-[92vh] rounded-xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 p-6 border-b border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{threat.title}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${threat.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                  threat.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                  }`}>
                  {threat.severity?.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${threat.status === 'viral' ? 'bg-red-500/20 text-red-400' :
                  threat.status === 'early_warning' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                  {threat.status?.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-3xl">{threat.description}</p>
            </div>
            <button
              onClick={() => setSelectedThreat(null)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors ml-4"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-900/50 border-b border-slate-800 flex overflow-x-auto">
          {['overview', 'videos', 'statements', 'redteam', 'deployment'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-semibold capitalize transition-all whitespace-nowrap border-b-2 ${activeTab === tab
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              {tab === 'overview' && <Target className="w-4 h-4 inline mr-2" />}
              {tab === 'videos' && <Video className="w-4 h-4 inline mr-2" />}
              {tab === 'statements' && <FileText className="w-4 h-4 inline mr-2" />}
              {tab === 'redteam' && <Shield className="w-4 h-4 inline mr-2" />}
              {tab === 'deployment' && <Rocket className="w-4 h-4 inline mr-2" />}
              {tab}
              {tab === 'videos' && arsenal.videos?.length > 0 && ` (${arsenal.videos.length})`}
              {tab === 'statements' && arsenal.textResponses?.length > 0 && ` (${arsenal.textResponses.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(92vh-220px)] custom-scrollbar bg-slate-950/50">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Arsenal Metrics Dashboard */}
              {arsenalMetrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass rounded-lg p-4 text-center border border-blue-500/30">
                    <div className="text-3xl font-bold text-blue-400 mb-1">{arsenalMetrics.totalAssets}</div>
                    <div className="text-sm text-gray-400">Total Assets</div>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">{arsenalMetrics.videoCount}</div>
                    <div className="text-sm text-gray-400">Videos Ready</div>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">{arsenalMetrics.textCount}</div>
                    <div className="text-sm text-gray-400">Statements</div>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-1">
                      {arsenalMetrics.totalReach >= 1000000
                        ? `${(arsenalMetrics.totalReach / 1000000).toFixed(1)}M`
                        : `${(arsenalMetrics.totalReach / 1000).toFixed(0)}K`}
                    </div>
                    <div className="text-sm text-gray-400">Est. Reach</div>
                  </div>
                </div>
              )}

              {/* Time Decay Visualization */}
              <div className="glass rounded-lg p-6 border border-orange-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold">Time Decay Analysis</h3>
                  <span className="ml-auto text-sm text-orange-400 font-semibold">Critical: Act Now</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Effectiveness drops ~{selectedThreat?.effectivenessDecayPerHour ||
                    (selectedThreat?.severity === 'critical' ? 23 : selectedThreat?.severity === 'high' ? 18 : 12)}% per hour.
                  <span className="text-orange-400 font-semibold"> Deploy within {selectedThreat?.responseWindowHours?.toFixed(1) || 4} hours for maximum impact.</span>
                </p>

                {/* Time decay graph */}
                <div className="relative h-48 bg-gradient-to-b from-slate-900/50 to-slate-900/20 rounded-lg p-4">
                  <svg className="w-full h-full" viewBox="0 0 600 160">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                      <line
                        key={y}
                        x1="40"
                        y1={140 - (y * 1.2)}
                        x2="580"
                        y2={140 - (y * 1.2)}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Y-axis labels */}
                    {[0, 25, 50, 75, 100].map(y => (
                      <text
                        key={y}
                        x="30"
                        y={145 - (y * 1.2)}
                        fill="rgba(255,255,255,0.5)"
                        fontSize="10"
                        textAnchor="end"
                      >
                        {y}%
                      </text>
                    ))}

                    {/* X-axis labels */}
                    {[0, 6, 12, 18, 24].map(hour => (
                      <text
                        key={hour}
                        x={40 + (hour * 540 / 24)}
                        y="155"
                        fill="rgba(255,255,255,0.5)"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {hour}h
                      </text>
                    ))}

                    {/* Decay curve */}
                    <path
                      d={timeDecayData.map((point, i) =>
                        `${i === 0 ? 'M' : 'L'} ${40 + (point.hour * 540 / 24)} ${140 - (point.effectiveness * 1.2)}`
                      ).join(' ')}
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                    />

                    {/* Fill under curve */}
                    <path
                      d={`
                        M 40 140 
                        ${timeDecayData.map((point, i) =>
                        `L ${40 + (point.hour * 540 / 24)} ${140 - (point.effectiveness * 1.2)}`
                      ).join(' ')}
                        L ${40 + (24 * 540 / 24)} 140 
                        Z
                      `}
                      fill="url(#areaGradient)"
                    />

                    {/* Current time marker */}
                    <line
                      x1="40"
                      y1="20"
                      x2="40"
                      y2="140"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <circle cx="40" cy={140 - (100 * 1.2)} r="4" fill="#10b981" />

                    {/* Critical threshold line */}
                    <line
                      x1="40"
                      y1={140 - (50 * 1.2)}
                      x2="580"
                      y2={140 - (50 * 1.2)}
                      stroke="#ef4444"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />

                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                        <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute top-2 left-12 text-xs text-green-400 font-semibold">
                    ● Now (100%)
                  </div>
                  <div className="absolute top-2 right-4 text-xs text-red-400">
                    Critical Threshold (50%)
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-400 mb-1">4 Hours</div>
                    <div className="text-lg font-bold text-green-400">
                      {Math.round(100 - (4 * (selectedThreat?.effectivenessDecayPerHour || 23)))}%
                    </div>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-400 mb-1">12 Hours</div>
                    <div className="text-lg font-bold text-orange-400">
                      {Math.max(0, Math.round(100 - (12 * (selectedThreat?.effectivenessDecayPerHour || 23))))}%
                    </div>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-400 mb-1">24 Hours</div>
                    <div className="text-lg font-bold text-red-400">
                      {Math.max(0, Math.round(100 - (24 * (selectedThreat?.effectivenessDecayPerHour || 23))))}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Distribution Network Preview */}
              {distributionPlan.immediate && (
                <div className="glass rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Distribution Network
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Immediate Deployment */}
                    <div className="relative">
                      <div className="text-center mb-3">
                        <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                          Phase 1: Immediate
                        </div>
                      </div>
                      {distributionPlan.immediate?.map((channel, i) => (
                        <div key={i} className="bg-slate-900/50 rounded-lg p-3 mb-2 border border-green-500/30">
                          <div className="font-semibold text-sm text-green-400">{channel.channel}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {channel.totalReach?.toLocaleString()} reach
                          </div>
                          <div className="text-xs text-green-400 mt-1">● {channel.readiness}</div>
                        </div>
                      ))}
                    </div>

                    {/* Phase 2 */}
                    {distributionPlan.phase2 && (
                      <div className="relative">
                        <div className="text-center mb-3">
                          <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                            Phase 2: 12-48h
                          </div>
                        </div>
                        {distributionPlan.phase2?.map((channel, i) => (
                          <div key={i} className="bg-slate-900/50 rounded-lg p-3 mb-2 border border-blue-500/30">
                            <div className="font-semibold text-sm text-blue-400">{channel.channel}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {channel.totalReach?.toLocaleString()} reach
                            </div>
                            <div className="text-xs text-blue-400 mt-1">● {channel.readiness}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Phase 3 */}
                    {distributionPlan.phase3 && (
                      <div className="relative">
                        <div className="text-center mb-3">
                          <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold">
                            Phase 3: 48-96h
                          </div>
                        </div>
                        {distributionPlan.phase3?.map((channel, i) => (
                          <div key={i} className="bg-slate-900/50 rounded-lg p-3 mb-2 border border-purple-500/30">
                            <div className="font-semibold text-sm text-purple-400">{channel.channel}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {channel.totalReach?.toLocaleString()} reach
                            </div>
                            <div className="text-xs text-purple-400 mt-1">● {channel.readiness}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeploymentAction('full_arsenal')}
                  disabled={loadingDeployment}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${loadingDeployment && deploymentAction === 'full_arsenal'
                      ? 'bg-green-700 cursor-wait'
                      : 'bg-green-600 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/50'
                    }`}
                >
                  {loadingDeployment && deploymentAction === 'full_arsenal' ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 inline mr-2" />
                      Deploy Arsenal
                    </>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('redteam')}
                  className="px-6 py-3 glass glass-hover rounded-lg font-semibold"
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Review Analysis
                </button>
              </div>
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <>
              {!arsenal.videos || arsenal.videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Video className="w-16 h-16 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-400">No AI Videos Generated Yet</h3>
                  <p className="text-gray-500 max-w-md">
                    AI-generated video responses will appear here once the arsenal is deployed for this threat.
                  </p>
                </div>
              ) : (
                <>
                  {/* Video Metrics Overview */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="glass rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">{arsenal.videos?.length}</div>
                      <div className="text-sm text-gray-400">Videos Ready</div>
                    </div>
                    <div className="glass rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {Math.round(arsenal.videos?.reduce((sum, v) => sum + v.estimatedEffectiveness, 0) / arsenal.videos?.length)}%
                      </div>
                      <div className="text-sm text-gray-400">Avg Effectiveness</div>
                    </div>
                    <div className="glass rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {((arsenal.videos?.reduce((sum, v) => sum + (v.estimatedReach || 0), 0) || 0) / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-400">Total Reach</div>
                    </div>
                  </div>

                  {/* Platform Distribution Chart */}
                  <div className="glass rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-3">Platform Distribution</h4>
                    <div className="flex gap-2 flex-wrap">
                      {(() => {
                        const platforms = {};
                        arsenal.videos?.forEach(v => {
                          v.platforms?.forEach(p => {
                            platforms[p] = (platforms[p] || 0) + 1;
                          });
                        });
                        return Object.entries(platforms).map(([platform, count]) => (
                          <div key={platform} className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-lg">
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                            <span className="text-sm">{platform}</span>
                            <span className="text-xs text-gray-400">({count})</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Video Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {arsenal.videos?.map((video, index) => (
                      <div key={video.id} className="glass rounded-lg p-4 border border-white/10 hover:border-purple-500/50 transition-all">
                        <div
                          className="aspect-video bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden group cursor-pointer"
                          onClick={() => video.videoFile && setFullscreenVideo(video)}
                        >
                          {video.videoFile ? (
                            <>
                              <video
                                className="w-full h-full object-cover rounded-lg"
                                preload="metadata"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <source src={`${import.meta.env.BASE_URL}${video.videoFile}`} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <Play className="w-16 h-16 text-white" />
                              </div>
                            </>
                          ) : (
                            <>
                              <Play className="w-16 h-16 text-white/50 group-hover:scale-110 transition-transform" />
                              <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-xs">
                                {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                              </div>
                              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-xs">
                                Video {index + 1}
                              </div>
                            </>
                          )}
                        </div>

                        <h4 className="font-semibold mb-2">{video.title}</h4>

                        <div className="flex gap-2 mb-3 flex-wrap">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">{video.tone}</span>
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{video.type}</span>
                        </div>

                        {/* Effectiveness Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Effectiveness</span>
                            <span className="text-green-400 font-semibold">{video.estimatedEffectiveness}%</span>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all"
                              style={{ width: `${video.estimatedEffectiveness}%` }}
                            />
                          </div>
                        </div>

                        {/* Reach */}
                        <div className="flex items-center gap-2 mb-3 text-sm">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-400">Est. Reach:</span>
                          <span className="font-semibold text-blue-400">
                            {video.estimatedReach >= 1000000
                              ? `${(video.estimatedReach / 1000000).toFixed(1)}M`
                              : `${(video.estimatedReach / 1000).toFixed(0)}K`}
                          </span>
                        </div>

                        <div className="text-sm text-gray-400 mb-3">
                          <strong>Key Points:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {video.keyPoints?.slice(0, 2).map((point, i) => (
                              <li key={i} className="text-xs">{point}</li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => handleVideoAction(video.id)}
                          disabled={loadingVideo === video.id}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all ${loadingVideo === video.id
                            ? 'bg-blue-700 cursor-wait'
                            : 'bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50'
                            }`}
                        >
                          {loadingVideo === video.id ? (
                            <>
                              <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 inline mr-1" />
                              Preview & Deploy
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Statements Tab */}
          {activeTab === 'statements' && (
            <>
              {!arsenal.textResponses || arsenal.textResponses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FileText className="w-16 h-16 text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-400">No AI Statements Generated Yet</h3>
                  <p className="text-gray-500 max-w-md">
                    AI-generated text responses and social media statements will appear here once the arsenal is deployed.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {arsenal.textResponses?.map(stmt => (
                    <div key={stmt.id} className="glass rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                            {stmt.platform}
                          </span>
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                            {stmt.persona}
                          </span>
                        </div>
                        <span className="text-green-400 font-semibold text-sm">
                          {stmt.estimatedEffectiveness}% Effectiveness
                        </span>
                      </div>
                      <textarea
                        className="w-full bg-gray-900/50 rounded-lg p-3 text-sm mb-3 border border-white/10 resize-none"
                        rows={4}
                        readOnly
                        value={stmt.content}
                      />
                      {stmt.hashtags && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {stmt.hashtags.map(tag => (
                            <span key={tag} className="text-blue-400 text-sm">{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(stmt.id, stmt.content)}
                          disabled={copiedId === stmt.id}
                          className={`px-4 py-2 rounded-lg text-sm transition-all ${copiedId === stmt.id
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'glass glass-hover'
                            }`}
                        >
                          {copiedId === stmt.id ? (
                            <>
                              <Check className="w-4 h-4 inline mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 inline mr-1" />
                              Copy
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleQueueStatement(stmt.id)}
                          disabled={loadingStatement === stmt.id}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold flex-1 transition-all ${loadingStatement === stmt.id
                            ? 'bg-blue-700 cursor-wait'
                            : 'bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50'
                            }`}
                        >
                          {loadingStatement === stmt.id ? (
                            <>
                              <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                              Queueing...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 inline mr-1" />
                              Queue for Deployment
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Red Team Tab */}
          {activeTab === 'redteam' && (
            <div className="space-y-6">
              {/* Risk Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-lg p-6 text-center border border-orange-500/30">
                  <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-orange-500 mb-1">{redTeam.overallRisk}</div>
                  <div className="text-sm text-gray-400">Overall Risk</div>
                </div>
                <div className="glass rounded-lg p-6 text-center border border-red-500/30">
                  <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-red-500 mb-1">{redTeam.responseBackfireRisk}%</div>
                  <div className="text-sm text-gray-400">Response Backfire Risk</div>
                </div>
                <div className="glass rounded-lg p-6 text-center border border-yellow-500/30">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-yellow-500 mb-1">{redTeam.silenceRisk}%</div>
                  <div className="text-sm text-gray-400">Silence Risk</div>
                </div>
              </div>

              {/* Respond vs Silence Comparison */}
              <div className="glass rounded-lg p-6 border border-blue-500/30">
                <h3 className="text-lg font-bold mb-4 text-center">Strategic Analysis: Respond vs Silence</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Respond Column */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="inline-block px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/50">
                        <CheckCircle className="w-5 h-5 inline mr-2 text-green-400" />
                        <span className="font-bold text-green-400">If We Respond</span>
                      </div>
                    </div>

                    {/* Best Case */}
                    <div className="glass rounded-lg p-4 border-l-4 border-green-500">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <strong className="text-green-400">Best Case Scenario</strong>
                      </div>
                      <p className="text-sm text-gray-300">{redTeam.ifRespond?.bestCase}</p>
                    </div>

                    {/* Likely Case */}
                    <div className="glass rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <strong className="text-blue-400">Most Likely Outcome</strong>
                      </div>
                      <p className="text-sm text-gray-300">{redTeam.ifRespond?.likelyCase}</p>
                    </div>

                    {/* Worst Case */}
                    <div className="glass rounded-lg p-4 border-l-4 border-orange-500">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <strong className="text-orange-400">Worst Case Scenario</strong>
                      </div>
                      <p className="text-sm text-gray-300">{redTeam.ifRespond?.worstCase}</p>
                    </div>

                    {/* Risk Score */}
                    <div className="glass rounded-lg p-3 bg-green-500/10">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{100 - redTeam.responseBackfireRisk}%</div>
                        <div className="text-xs text-gray-400">Success Probability</div>
                      </div>
                    </div>
                  </div>

                  {/* Silence Column */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="inline-block px-4 py-2 bg-red-500/20 rounded-lg border border-red-500/50">
                        <XCircle className="w-5 h-5 inline mr-2 text-red-400" />
                        <span className="font-bold text-red-400">If We Stay Silent</span>
                      </div>
                    </div>

                    {/* Best Case */}
                    <div className="glass rounded-lg p-4 border-l-4 border-green-500">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <strong className="text-green-400">Best Case Scenario</strong>
                      </div>
                      <p className="text-sm text-gray-300">{redTeam.ifSilent?.bestCase}</p>
                    </div>

                    {/* Likely Case */}
                    <div className="glass rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <strong className="text-blue-400">Most Likely Outcome</strong>
                      </div>
                      <p className="text-sm text-gray-300">{redTeam.ifSilent?.likelyCase}</p>
                    </div>

                    {/* Worst Case */}
                    <div className="glass rounded-lg p-4 border-l-4 border-red-500">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <strong className="text-red-400">Worst Case Scenario</strong>
                      </div>
                      <p className="text-sm text-gray-300">{redTeam.ifSilent?.worstCase}</p>
                    </div>

                    {/* Risk Score */}
                    <div className="glass rounded-lg p-3 bg-red-500/10">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{redTeam.silenceRisk}%</div>
                        <div className="text-xs text-gray-400">Damage Probability</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="glass rounded-lg p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-2 text-blue-400 text-lg">Red Team Recommendation</h4>
                    <p className="text-lg font-semibold mb-2">{redTeam.recommendation}</p>
                    {redTeam.responseBackfireRisk < redTeam.silenceRisk ? (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Response recommended: {redTeam.silenceRisk - redTeam.responseBackfireRisk}% lower risk than silence</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-orange-400 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Caution: Response carries higher risk by {redTeam.responseBackfireRisk - redTeam.silenceRisk}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Deployment Tab */}
          {activeTab === 'deployment' && (
            <div className="space-y-6">
              <div className="glass rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Deployment Workflow</h3>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Threat Detected', status: 'completed' },
                    { step: 2, title: 'Arsenal Generated', status: 'completed' },
                    { step: 3, title: 'Red Team Analysis', status: 'completed' },
                    { step: 4, title: 'Human Approval Required', status: 'current' },
                    { step: 5, title: 'Deploy to Channels', status: 'pending' },
                    { step: 6, title: 'Monitor Impact', status: 'pending' }
                  ].map(item => (
                    <div key={item.step} className={`flex items-center gap-4 p-3 rounded-lg ${item.status === 'completed' ? 'glass' :
                      item.status === 'current' ? 'bg-blue-500/20 border border-blue-500/50' :
                        'bg-gray-800/50'
                      }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${item.status === 'completed' ? 'bg-green-500 text-white' :
                        item.status === 'current' ? 'bg-blue-500 text-white' :
                          'bg-gray-700 text-gray-400'
                        }`}>
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{item.title}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleDeploymentAction('approve')}
                    disabled={loadingDeployment}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${loadingDeployment && deploymentAction === 'approve'
                      ? 'bg-green-700 cursor-wait'
                      : 'bg-green-600 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/50'
                      } ${loadingDeployment && deploymentAction !== 'approve' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loadingDeployment && deploymentAction === 'approve' ? (
                      <>
                        <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      '✓ Approve & Deploy'
                    )}
                  </button>
                  <button
                    onClick={() => handleDeploymentAction('modify')}
                    disabled={loadingDeployment}
                    className={`px-6 py-3 rounded-lg transition-all ${loadingDeployment && deploymentAction === 'modify'
                      ? 'bg-white/20 cursor-wait'
                      : 'glass glass-hover'
                      } ${loadingDeployment && deploymentAction !== 'modify' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loadingDeployment && deploymentAction === 'modify' ? (
                      <>
                        <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Modify'
                    )}
                  </button>
                  <button
                    onClick={() => handleDeploymentAction('reject')}
                    disabled={loadingDeployment}
                    className={`px-6 py-3 rounded-lg transition-all ${loadingDeployment && deploymentAction === 'reject'
                      ? 'bg-red-700/40 cursor-wait'
                      : 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                      } ${loadingDeployment && deploymentAction !== 'reject' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loadingDeployment && deploymentAction === 'reject' ? (
                      <>
                        <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      'Reject'
                    )}
                  </button>
                </div>
              </div>

              <div className="glass rounded-lg p-4">
                <h4 className="font-bold mb-3">Distribution Channels</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {distributionPlan.immediate?.map((channel, i) => (
                    <div key={i} className="glass rounded-lg p-3">
                      <div className="font-semibold text-sm">{channel.channel}</div>
                      <div className="text-xs text-gray-400">{channel.totalReach?.toLocaleString()} reach · {channel.deployTime}</div>
                      <div className={`text-xs mt-1 ${channel.readiness === 'ready' ? 'text-green-400' : 'text-orange-400'}`}>
                        {channel.readiness === 'ready' ? '✓ Ready' : channel.readiness}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      {fullscreenVideo && (
        <div
          className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
          onClick={() => setFullscreenVideo(null)}
        >
          <button
            onClick={() => setFullscreenVideo(null)}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full h-full flex items-center justify-center p-8" onClick={(e) => e.stopPropagation()}>
            <video
              className="max-w-full max-h-full"
              controls
              autoPlay
              src={`${import.meta.env.BASE_URL}${fullscreenVideo.videoFile}`}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 px-6 py-3 rounded-lg">
            <h3 className="text-lg font-semibold text-center">{fullscreenVideo.title}</h3>
          </div>
        </div>
      )}
    </div >
  );
}
