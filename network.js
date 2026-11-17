// ============================================================================
// PEERJS PARTY & 128-TICK SQUAD MULTIPLAYER (Supports ?party=VAL-XXXX Links)
// ============================================================================
const Network = {
  peer: null,
  connections: [],
  remotePlayers: {},
  isHost: false,
  roomId: null,

  initFromURL() {
    const params = new URLSearchParams(window.location.search);
    const partyCode = params.get('party');
    if (partyCode) {
      const input = document.getElementById('room-code-input');
      if (input) input.value = partyCode;
      setTimeout(() => this.joinRoom(), 600);
    }
  },

  createRoom() {
    const id = 'VAL-' + Math.floor(1000 + Math.random() * 9000);
    this.isHost = true;
    this.roomId = id;
    this.peer = new Peer(id);

    this.peer.on('open', (openId) => {
      const inviteUrl = `${window.location.origin}${window.location.pathname}?party=${openId}`;
      navigator.clipboard?.writeText(inviteUrl).catch(() => {});
      document.getElementById('room-status').innerHTML =
        `PARTY CODE: <b>${openId}</b> (Invite link copied!)`;
      document.getElementById('party-privacy').innerText = 'OPEN PARTY';
      this.updateRoster();
    });

    this.peer.on('connection', (conn) => {
      this.connections.push(conn);
      this.setupConnection(conn);
    });
  },

  joinRoom() {
    const targetId = document.getElementById('room-code-input').value.trim();
    if (!targetId) return;
    this.isHost = false;
    this.peer = new Peer();

    this.peer.on('open', () => {
      const conn = this.peer.connect(targetId);
      this.connections.push(conn);
      this.setupConnection(conn);
      document.getElementById('room-status').innerText = `Connected to Party: ${targetId}`;
      document.getElementById('party-privacy').innerText = 'IN PARTY';
    });
  },

  setupConnection(conn) {
    conn.on('open', () => {
      const myName = document.getElementById('player-name').value || 'Riot Player';
      conn.send({ type: 'HELLO', name: myName, agent: Game.selectedAgent });
    });

    conn.on('data', (data) => {
      if (data.type === 'HELLO' || data.type === 'POS') {
        this.remotePlayers[conn.peer] = data;
        if (data.type === 'POS' && typeof Game !== 'undefined') {
          Game.syncRemotePlayer(conn.peer, data);
        }
      } else if (data.type === 'AGENT_SELECT') {
        Game.enterAgentSelect(true);
      } else if (data.type === 'START_MATCH') {
        Game.startMatch(data.map, true);
      } else if (data.type === 'SPIKE_PLANTED') {
        Game.spikePlanted = true;
        Game.plantedSite = data.site;
      }
      this.updateRoster();
    });
  },

  broadcast(payload) {
    this.connections.forEach((c) => {
      if (c.open) c.send(payload);
    });
  },

  updateRoster() {
    const list = document.getElementById('connected-players');
    if (!list) return;
    const myName = document.getElementById('player-name').value || 'Riot Player';
    list.innerHTML = `<li>${myName} (${this.isHost ? 'Party Leader' : 'Member'} • Ready)</li>`;
    Object.values(this.remotePlayers).forEach((p) => {
      const li = document.createElement('li');
      li.innerText = `${p.name} (${p.agent || 'PHOENIX'} • In Party)`;
      list.appendChild(li);
    });
  }
};

window.addEventListener('DOMContentLoaded', () => Network.initFromURL());
