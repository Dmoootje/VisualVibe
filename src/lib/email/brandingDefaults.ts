// Standaard e-mailheader en -footer (door de klant aangeleverde HTML).
// Client-veilig (pure strings): de admin-opmaaktab gebruikt ze voor
// "Herstel standaard" en de preview; de mailtemplates als fallback-default.
// De placeholder {{currentYear}} wordt bij het renderen vervangen.

export const DEFAULT_EMAIL_HEADER_HTML = `<!-- VISUALVIBE E-MAILHEADER -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="width:100%;border-collapse:collapse;border-spacing:0;margin:0;padding:0;">
  <tbody>
    <tr>
      <td align="center" style="padding:16px 12px 0;margin:0;">
        <!-- HEADER CONTAINER -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="width:100%;max-width:600px;border-collapse:separate;border-spacing:0;background-color:#050505;border:1px solid #242424;border-bottom:0;border-radius:16px 16px 0 0;overflow:hidden;">
          <tbody>
            <!-- ORANJE ACCENTLIJN -->
            <tr>
              <td style="height:3px;padding:0;margin:0;font-size:1px;line-height:1px;background-color:#ff8a00;background-image:linear-gradient(90deg,#ff6a00 0%,#ffb000 50%,#ff6a00 100%);">&nbsp;</td>
            </tr>
            <!-- LOGO -->
            <tr>
              <td align="center" style="padding:18px 28px 17px;margin:0;text-align:center;background-color:#050505;">
                <a href="https://visualvibe.media/" target="_blank" rel="noopener" title="VisualVibe" style="display:inline-block;text-decoration:none;">
                  <img src="https://visualvibe.media/logo-email.png" alt="VisualVibe" width="190" style="display:block;width:190px;max-width:100%;height:auto;margin:0 auto;padding:0;border:0;outline:none;text-decoration:none;">
                </a>
              </td>
            </tr>
            <!-- SUBTIELE SCHEIDINGSLIJN -->
            <tr>
              <td style="padding:0 28px;margin:0;background-color:#050505;">
                <div style="height:1px;background-color:#242424;font-size:1px;line-height:1px;">&nbsp;</div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;

export const DEFAULT_EMAIL_FOOTER_HTML = `<!-- VISUALVIBE E-MAILFOOTER -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="width:100%;border-collapse:collapse;border-spacing:0;margin:0;padding:0;">
  <tbody>
    <tr>
      <td align="center" style="padding:0 12px 16px;margin:0;">
        <!-- FOOTER CONTAINER -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="width:100%;max-width:600px;border-collapse:separate;border-spacing:0;background-color:#050505;border:1px solid #242424;border-top:0;border-radius:0 0 16px 16px;overflow:hidden;">
          <tbody>
            <!-- BOVENSTE SCHEIDING -->
            <tr>
              <td style="padding:0 28px;margin:0;background-color:#050505;">
                <div style="height:1px;background-color:#242424;font-size:1px;line-height:1px;">&nbsp;</div>
              </td>
            </tr>
            <!-- LOGO -->
            <tr>
              <td align="center" style="padding:26px 30px 18px;margin:0;text-align:center;background-color:#050505;">
                <a href="https://visualvibe.media/" target="_blank" rel="noopener" title="VisualVibe" style="display:inline-block;text-decoration:none;">
                  <img src="https://visualvibe.media/logo-email.png" alt="VisualVibe" width="205" style="display:block;width:205px;max-width:100%;height:auto;margin:0 auto;padding:0;border:0;outline:none;text-decoration:none;">
                </a>
              </td>
            </tr>
            <!-- BESCHRIJVING -->
            <tr>
              <td align="center" style="padding:0 38px 20px;margin:0;text-align:center;">
                <div style="max-width:480px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:21px;color:#b5b5b5;">
                  Creatief mediabureau in Limburg voor webdesign, SEO, fotografie, videografie, drone, 3D/VR/AR en podcasting.
                </div>
              </td>
            </tr>
            <!-- CONTACTGEGEVENS -->
            <tr>
              <td align="center" style="padding:0 28px 22px;margin:0;text-align:center;">
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto;border-collapse:collapse;">
                  <tbody>
                    <tr>
                      <td width="26" valign="middle" style="width:26px;padding:5px 9px 5px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:20px;color:#ff8a00;">&#9993;</td>
                      <td valign="middle" style="padding:5px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;">
                        <a href="mailto:info@visualvibe.be" style="color:#ffffff;text-decoration:none;">info@visualvibe.be</a>
                      </td>
                    </tr>
                    <tr>
                      <td width="26" valign="middle" style="width:26px;padding:5px 9px 5px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:20px;color:#ff8a00;">&#9742;</td>
                      <td valign="middle" style="padding:5px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;">
                        <a href="tel:+32472964599" style="color:#ffffff;text-decoration:none;">+32 472 96 45 99</a>
                      </td>
                    </tr>
                    <tr>
                      <td width="26" valign="top" style="width:26px;padding:5px 9px 5px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:20px;color:#ff8a00;">&#9679;</td>
                      <td valign="top" style="padding:5px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;">
                        <a href="https://www.google.com/maps/dir//VisualVibe+-+Fotograaf+Limburg,+Ziegelsmeer+14,+3700+Tongeren-Borgloon/@50.792645,5.469349,14z/data=!4m17!1m7!3m6!1s0x47c0dd0f1b0799b7:0xe29d6668387bd875!2sVisualVibe+-+Fotograaf+Limburg!8m2!3d50.7926451!4d5.469349!16s%2Fg%2F11l21256qp!4m8!1m0!1m5!1m1!1s0x47c0dd0f1b0799b7:0xe29d6668387bd875!2m2!1d5.469349!2d50.7926451!3e0?hl=nl&amp;entry=ttu&amp;g_ep=EgoyMDI2MDcwNi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:none;">
                          Ziegelsmeer 14<br>3700 Tongeren-Borgloon, Belgi&euml;
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <!-- WEBSITEKNOP -->
            <tr>
              <td align="center" style="padding:0 30px 25px;margin:0;text-align:center;">
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto;border-collapse:separate;">
                  <tbody>
                    <tr>
                      <td align="center" bgcolor="#ff8a00" style="background-color:#ff8a00;border-radius:8px;">
                        <a href="https://visualvibe.media/" target="_blank" rel="noopener" style="display:inline-block;padding:11px 22px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;font-weight:700;color:#000000;text-decoration:none;border-radius:8px;">Bezoek visualvibe.media</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <!-- SCHEIDINGSLIJN -->
            <tr>
              <td style="padding:0 28px;margin:0;">
                <div style="height:1px;background-color:#242424;font-size:1px;line-height:1px;">&nbsp;</div>
              </td>
            </tr>
            <!-- SOCIALE MEDIA TITEL -->
            <tr>
              <td align="center" style="padding:20px 20px 12px;margin:0;text-align:center;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:19px;color:#b5b5b5;">Volg VisualVibe</div>
              </td>
            </tr>
            <!-- SOCIALE MEDIA -->
            <tr>
              <td align="center" style="padding:0 12px 23px;margin:0;text-align:center;">
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto;border-collapse:collapse;">
                  <tbody>
                    <tr>
                      <td style="padding:0 6px;">
                        <a href="https://www.facebook.com/visualvibee" target="_blank" rel="noopener" title="VisualVibe op Facebook" style="display:block;text-decoration:none;">
                          <img src="https://img.icons8.com/ios-filled/48/FF8A00/facebook-new.png" alt="Facebook" width="32" height="32" style="display:block;width:32px;height:32px;border:0;outline:none;text-decoration:none;">
                        </a>
                      </td>
                      <td style="padding:0 6px;">
                        <a href="https://www.instagram.com/visualvibe.be/" target="_blank" rel="noopener" title="VisualVibe op Instagram" style="display:block;text-decoration:none;">
                          <img src="https://img.icons8.com/ios-filled/48/FF8A00/instagram-new--v1.png" alt="Instagram" width="32" height="32" style="display:block;width:32px;height:32px;border:0;outline:none;text-decoration:none;">
                        </a>
                      </td>
                      <td style="padding:0 6px;">
                        <a href="https://www.linkedin.com/company/visualvibee" target="_blank" rel="noopener" title="VisualVibe op LinkedIn" style="display:block;text-decoration:none;">
                          <img src="https://img.icons8.com/ios-filled/48/FF8A00/linkedin.png" alt="LinkedIn" width="32" height="32" style="display:block;width:32px;height:32px;border:0;outline:none;text-decoration:none;">
                        </a>
                      </td>
                      <td style="padding:0 6px;">
                        <a href="https://www.youtube.com/@visualvibe_be" target="_blank" rel="noopener" title="VisualVibe op YouTube" style="display:block;text-decoration:none;">
                          <img src="https://img.icons8.com/ios-filled/48/FF8A00/youtube-play.png" alt="YouTube" width="32" height="32" style="display:block;width:32px;height:32px;border:0;outline:none;text-decoration:none;">
                        </a>
                      </td>
                      <td style="padding:0 6px;">
                        <a href="https://www.tiktok.com/@visualvibe_" target="_blank" rel="noopener" title="VisualVibe op TikTok" style="display:block;text-decoration:none;">
                          <img src="https://img.icons8.com/ios-filled/48/FF8A00/tiktok--v1.png" alt="TikTok" width="32" height="32" style="display:block;width:32px;height:32px;border:0;outline:none;text-decoration:none;">
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <!-- COPYRIGHT -->
            <tr>
              <td align="center" style="padding:15px 24px 20px;margin:0;background-color:#0a0a0a;border-top:1px solid #1e1e1e;text-align:center;border-radius:0 0 16px 16px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:#777777;">
                  &copy; {{currentYear}} <a href="https://visualvibe.media/" target="_blank" rel="noopener" style="color:#999999;text-decoration:underline;">VisualVibe</a> &middot; Alle rechten voorbehouden
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;

/** Vervangt ondersteunde placeholders in header-/footer-HTML. */
export function renderBrandingHtml(html: string): string {
  return html.replaceAll("{{currentYear}}", String(new Date().getFullYear()));
}
