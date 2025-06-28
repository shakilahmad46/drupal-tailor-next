<?php

use Drupal\node\Entity\Node;
use Drupal\Core\DrupalKernel;
use Symfony\Component\HttpFoundation\Request;

// Bootstrap Drupal
$autoloader = require_once 'web/autoload.php';
$kernel = new DrupalKernel('prod', $autoloader);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$kernel->boot();

// Create Homepage
$homepage = Node::create([
  'type' => 'page',
  'title' => 'Homepage',
  'body' => [
    'value' => '<div class="hero-banner">
      <h1>Professional Tailoring Management System</h1>
      <p>Streamline your tailoring business with our comprehensive measurement and order management solution.</p>
    </div>
    
    <div class="intro-section">
      <h2>Welcome to TailorPro</h2>
      <p>Our advanced tailoring management system helps you manage customer measurements, track orders, and grow your business efficiently. Designed specifically for Pakistani garment specialists including Shalwar Qameez, Shirts, Coats, and Waistcoats.</p>
    </div>
    
    <div class="features-section">
      <h2>System Features</h2>
      <div class="feature-cards">
        <div class="feature-card">
          <h3>Measurement Management</h3>
          <p>Store detailed measurements for different garment types with precision and accuracy.</p>
        </div>
        <div class="feature-card">
          <h3>Order Tracking</h3>
          <p>Keep track of customer orders from initial measurement to final delivery.</p>
        </div>
        <div class="feature-card">
          <h3>Customer Database</h3>
          <p>Maintain comprehensive customer profiles with measurement history.</p>
        </div>
        <div class="feature-card">
          <h3>Multi-Garment Support</h3>
          <p>Support for traditional Pakistani garments and modern clothing styles.</p>
        </div>
      </div>
    </div>',
    'format' => 'full_html',
  ],
  'status' => 1,
  'promote' => 1,
]);
$homepage->save();
echo "Homepage created with ID: " . $homepage->id() . "\n";

// Create About Us page
$about = Node::create([
  'type' => 'page',
  'title' => 'About Us',
  'body' => [
    'value' => '<h1>About TailorPro</h1>
    
    <p>TailorPro is a comprehensive tailoring management system designed to revolutionize how tailoring businesses operate in the digital age. Our platform combines traditional craftsmanship with modern technology to provide an efficient, user-friendly solution for managing measurements, orders, and customer relationships.</p>
    
    <h2>Our Mission</h2>
    <p>To empower tailoring professionals with cutting-edge tools that enhance their craft, improve customer satisfaction, and drive business growth. We believe that technology should complement, not complicate, the art of tailoring.</p>
    
    <h2>Why Choose TailorPro?</h2>
    <ul>
      <li><strong>Specialized for Pakistani Garments:</strong> Built with deep understanding of traditional clothing like Shalwar Qameez, Sherwanis, and formal wear.</li>
      <li><strong>Precision Measurement System:</strong> Detailed measurement fields ensure perfect fit every time.</li>
      <li><strong>User-Friendly Interface:</strong> Intuitive design that requires minimal training.</li>
      <li><strong>Scalable Solution:</strong> Grows with your business from single tailor to large workshop.</li>
      <li><strong>Data Security:</strong> Your customer data is protected with enterprise-grade security.</li>
    </ul>
    
    <h2>Our Team</h2>
    <p>Our team consists of experienced software developers, UX designers, and tailoring industry experts who understand the unique challenges faced by tailoring businesses. We are committed to continuous improvement and innovation.</p>',
    'format' => 'full_html',
  ],
  'status' => 1,
]);
$about->save();
echo "About Us page created with ID: " . $about->id() . "\n";

// Create Privacy Policy page
$privacy = Node::create([
  'type' => 'page',
  'title' => 'Privacy Policy',
  'body' => [
    'value' => '<h1>Privacy Policy</h1>
    <p><em>Last updated: ' . date('F j, Y') . '</em></p>
    
    <h2>Information We Collect</h2>
    <p>TailorPro collects information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
    
    <h3>Personal Information</h3>
    <ul>
      <li>Name and contact information</li>
      <li>Account credentials</li>
      <li>Customer measurement data</li>
      <li>Order and transaction information</li>
      <li>Communication preferences</li>
    </ul>
    
    <h2>How We Use Your Information</h2>
    <p>We use the information we collect to:</p>
    <ul>
      <li>Provide, maintain, and improve our services</li>
      <li>Process transactions and send related information</li>
      <li>Send technical notices and support messages</li>
      <li>Respond to your comments and questions</li>
      <li>Protect against fraudulent or illegal activity</li>
    </ul>
    
    <h2>Information Sharing</h2>
    <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
    
    <h2>Data Security</h2>
    <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
    
    <h2>Your Rights</h2>
    <p>You have the right to:</p>
    <ul>
      <li>Access your personal information</li>
      <li>Correct inaccurate data</li>
      <li>Request deletion of your data</li>
      <li>Object to processing of your data</li>
      <li>Data portability</li>
    </ul>
    
    <h2>Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, please contact us at privacy@tailorpro.com</p>',
    'format' => 'full_html',
  ],
  'status' => 1,
]);
$privacy->save();
echo "Privacy Policy page created with ID: " . $privacy->id() . "\n";

echo "All pages created successfully!\n";
