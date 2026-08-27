const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleEnquiry(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
  }

  const name = (data.name || '').toString().trim().slice(0, 200);
  const contact = (data.contact || '').toString().trim().slice(0, 200);
  const message = (data.message || data.need || '').toString().trim().slice(0, 5000);

  if (!name || !contact) {
    return jsonResponse({ ok: false, error: 'Missing name or contact' }, 400);
  }

  const lines = [`Name: ${name}`, `Email/phone: ${contact}`];
  if (message) lines.push(`What they need: ${message}`);
  const text = lines.join('\n');
  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email/phone:</strong> ${escapeHtml(contact)}</p>`,
    message ? `<p><strong>What they need:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>` : '',
  ].join('');

  const payload = {
    from: 'Legend Website Design <enquiry@legendwebsites.co.uk>',
    to: ['p.g.davis@outlook.com'],
    subject: `New project enquiry from ${name}`,
    text,
    html,
  };
  if (EMAIL_RE.test(contact)) {
    payload.reply_to = contact;
  }

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resendRes.ok) {
    console.log('Resend send failed', resendRes.status, await resendRes.text());
    return jsonResponse({ ok: false, error: 'Failed to send' }, 502);
  }

  return jsonResponse({ ok: true }, 200);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'legendwebsites.co.uk') {
      url.hostname = 'www.legendwebsites.co.uk';
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === '/api/enquiry') {
      return handleEnquiry(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
