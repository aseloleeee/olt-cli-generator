import React, { useState } from "react";

const OltCliGenerator = () => {
  const [slot, setSlot] = useState("");
  const [pon, setPon] = useState("");
  const [onu, setOnu] = useState("");
  const [sn, setSn] = useState("");
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");

const generateCliScript = () => {
  const vlan = pon < 10 ? `1${slot}0${pon}` : `1${slot}${pon}`;  // Menambahkan '0' untuk PON 1 sampai 9
// const vlan = `${slot}20${pon}`;
  const s1px = `S${slot}-P${pon}`;
  const onuId = `${onu}`;

  // Di sini kita memastikan angka tengah sesuai dengan slot yang dipilih
  const middle = slot === 1 ? 1 : slot;  // Jika slot 1, gunakan '1', jika tidak gunakan angka slot sebagai angka tengah
  
  const script = `
interface gpon-olt_1/${middle}/${pon}
onu ${onuId} type ZXHN-F609 sn ${sn}
exit
interface gpon-onu_1/${middle}/${pon}:${onuId}
name ${namaPelanggan}
tcont 1 profile HOME-PPPOE
gemport 1 tcont 1
gemport 1 traffic-limit downstream HOME-PPPOE
service-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}
exit
pon-onu-mng gpon-onu_1/${middle}/${pon}:${onuId}
service ${s1px} gemport 1 vlan ${vlan}
wan-ip 1 mode pppoe username ${username} password ${password} vlan-profile ${s1px} host 1
security-mgmt 212 state enable mode forward protocol web https
interface eth eth_0/1 state lock
interface eth eth_0/2 state lock
interface eth eth_0/3 state lock
interface eth eth_0/4 state lock
  `;
  setOutput(script);
};

// const copyToClipboard = () => {
//     if (navigator.clipboard && navigator.clipboard.writeText) {
//       navigator.clipboard.writeText(output).then(() => {
//         alert("Script berhasil disalin!");
//       }).catch(err => {
//         console.error("Clipboard error:", err);
//         alert("Gagal menyalin ke clipboard.");
//       });
//     } else {
//       alert("Clipboard tidak didukung di browser ini.");
//     }
//   };
const copyToClipboard = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(output).then(() => {
        alert("Script berhasil disalin!");
      }).catch(err => {
        console.error("Clipboard error:", err);
        alert("Gagal menyalin ke clipboard.");
      });
    } else {
      // Fallback jika clipboard API tidak didukung atau HTTP
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("Script berhasil disalin!");
    }
  };

  return (
    <div>
      <h1>OLT CLI Generator</h1>
      <div>
        <label>Slot:</label>
        <input
          type="text"
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
        />
      </div>
      <div>
        <label>PON:</label>
        <input
          type="text"
          value={pon}
          onChange={(e) => setPon(e.target.value)}
        />
      </div>
      <div>
        <label>ONU:</label>
        <input
          type="text"
          value={onu}
          onChange={(e) => setOnu(e.target.value)}
        />
      </div>
      <div>
        <label>Serial Number (SN):</label>
        <input
          type="text"
          value={sn}
          onChange={(e) => setSn(e.target.value)}
        />
      </div>
      <div>
        <label>Nama Pelanggan:</label>
        <input
          type="text"
          value={namaPelanggan}
          onChange={(e) => setNamaPelanggan(e.target.value)}
        />
      </div>
      <div>
        <label>Username PPPoE:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password PPPoE:</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={generateCliScript}>Submit</button>

      {output && (
        <div>
          <h2>Generated CLI Script</h2>
          <textarea value={output} readOnly rows="10" cols="80" />
          <br />
          <button onClick={copyToClipboard}>Copy</button>
        </div>
      )}
    </div>
  );
};

export default OltCliGenerator;
