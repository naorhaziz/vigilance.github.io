import { X, Video, FileText, Shield, Rocket, Play, Copy, Send, Loader2, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState } from 'react';

export default function ThreatModal() {
  const { selectedThreat, setSelectedThreat } = useStore();
  const [activeTab, setActiveTab] = useState('videos');

  // Loading states for different actions
  const [loadingVideo, setLoadingVideo] = useState(null);
  const [loadingStatement, setLoadingStatement] = useState(null);
  const [loadingDeployment, setLoadingDeployment] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [deploymentAction, setDeploymentAction] = useState(null);

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
  const arsenal = threat.aiArsenal || {};
  const redTeam = threat.redTeam || {};

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setSelectedThreat(null)}
    >
      <div className="glass max-w-6xl w-full max-h-[90vh] rounded-2xl overflow-hidden border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{threat.title}</h2>
            <p className="text-gray-400">{threat.description}</p>
          </div>
          <button onClick={() => setSelectedThreat(null)} className="p-2 glass-hover rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 flex overflow-x-auto">
          {['videos', 'statements', 'redteam', 'deployment'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'videos' && <Video className="w-4 h-4 inline mr-2" />}
              {tab === 'statements' && <FileText className="w-4 h-4 inline mr-2" />}
              {tab === 'redteam' && <Shield className="w-4 h-4 inline mr-2" />}
              {tab === 'deployment' && <Rocket className="w-4 h-4 inline mr-2" />}
              {tab}
              {tab === 'videos' && ` (${arsenal.videos?.length || 0})`}
              {tab === 'statements' && ` (${arsenal.statements?.length || 0})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {arsenal.videos?.map(video => (
                <div key={video.id} className="glass rounded-lg p-4 border border-white/10">
                  <div className="aspect-video bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg mb-3 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white/50" />
                  </div>
                  <h4 className="font-semibold mb-2">{video.title}</h4>
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">{video.tone}</span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{video.platform}</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">{video.projectedEffectiveness}% effective</span>
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
                    className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      loadingVideo === video.id
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
          )}

          {/* Statements Tab */}
          {activeTab === 'statements' && (
            <div className="space-y-4">
              {arsenal.statements?.map(stmt => (
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
                      {stmt.projectedEffectiveness}% Effectiveness
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
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        copiedId === stmt.id
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
                      className={`px-4 py-2 rounded-lg text-sm font-semibold flex-1 transition-all ${
                        loadingStatement === stmt.id
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

          {/* Red Team Tab */}
          {activeTab === 'redteam' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-1">{redTeam.overallRisk}</div>
                  <div className="text-sm text-gray-400">Overall Risk</div>
                </div>
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-500 mb-1">{redTeam.responseBackfireRisk}%</div>
                  <div className="text-sm text-gray-400">Response Backfire Risk</div>
                </div>
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-500 mb-1">{redTeam.silenceRisk}%</div>
                  <div className="text-sm text-gray-400">Silence Risk</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass rounded-lg p-4">
                  <h4 className="font-bold mb-3 text-green-400">If We Respond</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong className="text-green-400">Best:</strong>
                      <p className="text-gray-400">{redTeam.analysis?.ifRespond?.bestCase}</p>
                    </div>
                    <div>
                      <strong className="text-blue-400">Likely:</strong>
                      <p className="text-gray-400">{redTeam.analysis?.ifRespond?.likelyCase}</p>
                    </div>
                    <div>
                      <strong className="text-orange-400">Worst:</strong>
                      <p className="text-gray-400">{redTeam.analysis?.ifRespond?.worstCase}</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-lg p-4">
                  <h4 className="font-bold mb-3 text-red-400">If We Stay Silent</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong className="text-green-400">Best:</strong>
                      <p className="text-gray-400">{redTeam.analysis?.ifSilent?.bestCase}</p>
                    </div>
                    <div>
                      <strong className="text-blue-400">Likely:</strong>
                      <p className="text-gray-400">{redTeam.analysis?.ifSilent?.likelyCase}</p>
                    </div>
                    <div>
                      <strong className="text-orange-400">Worst:</strong>
                      <p className="text-gray-400">{redTeam.analysis?.ifSilent?.worstCase}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-lg p-4 bg-blue-500/5 border border-blue-500/30">
                <h4 className="font-bold mb-2 text-blue-400">Recommendation</h4>
                <p className="text-lg font-semibold">{redTeam.recommendation}</p>
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
                    <div key={item.step} className={`flex items-center gap-4 p-3 rounded-lg ${
                      item.status === 'completed' ? 'glass' :
                      item.status === 'current' ? 'bg-blue-500/20 border border-blue-500/50' :
                      'bg-gray-800/50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        item.status === 'completed' ? 'bg-green-500 text-white' :
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
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                      loadingDeployment && deploymentAction === 'approve'
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
                    className={`px-6 py-3 rounded-lg transition-all ${
                      loadingDeployment && deploymentAction === 'modify'
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
                    className={`px-6 py-3 rounded-lg transition-all ${
                      loadingDeployment && deploymentAction === 'reject'
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
                  {threat.distributionChannels?.official?.map((channel, i) => (
                    <div key={i} className="glass rounded-lg p-3">
                      <div className="font-semibold text-sm">{channel.name}</div>
                      <div className="text-xs text-gray-400">{channel.reach?.toLocaleString()} reach · {channel.responseTime}</div>
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
    </div>
  );
}
