<?php
/**
 * Settings for contact.php. On Bluehost, save a copy as qadco-config.php in your HOME folder
 * (one level ABOVE public_html, next to it), never inside public_html.
 */
define('RESEND_API_KEY', 're_your_resend_api_key_here');
define('CONTACT_TO', 'qadco-1@qatar.net.qa');
// Until your domain is verified in Resend, keep the test sender (it can only deliver to the
// email address your Resend account was created with).
define('CONTACT_FROM', 'QADCO Website <onboarding@resend.dev>');
