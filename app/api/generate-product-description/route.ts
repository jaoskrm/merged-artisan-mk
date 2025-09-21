import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productInfo, regenerateSection } = await request.json();
    
    let systemPrompt, userPrompt;

    if (regenerateSection) {
      // For regenerating specific sections
      systemPrompt = `You are enhancing a specific section of a product listing. Return ONLY a valid JSON object with the updated section. Do not include any other text or formatting.`;
      
      userPrompt = `Regenerate only the "${regenerateSection}" section for this product listing.

Product Details:
- Name: ${productInfo.name}
- Category: ${productInfo.category}
- Price: $${productInfo.priceMin}
- Description: ${productInfo.description}
- Materials: ${productInfo.materials}
- Techniques: ${productInfo.techniques}

Based on these details, generate ONLY the "${regenerateSection}" field in this exact JSON format:

${regenerateSection === 'title' ? `{"title": "Enhanced product title here"}` : ''}
${regenerateSection === 'shortDescription' ? `{"shortDescription": "Brief engaging summary here"}` : ''}
${regenerateSection === 'keyFeatures' ? `{"keyFeatures": ["feature 1", "feature 2", "feature 3", "feature 4"]}` : ''}
${regenerateSection === 'highlights' ? `{"highlights": ["highlight 1", "highlight 2", "highlight 3"]}` : ''}
${regenerateSection === 'specifications' ? `{"specifications": {"materials": "materials here", "dimensions": "dimensions here", "technique": "technique here", "style": "style here", "care": "care instructions"}}` : ''}
${regenerateSection === 'tags' ? `{"tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]}` : ''}
${regenerateSection === 'story' ? `{"story": "Brief artisan story here"}` : ''}

Return ONLY the JSON object, no other text.`;
    } else {
      // For full product generation
      systemPrompt = `You are an expert product listing optimizer for artisan marketplaces. Create structured, professional product information. Always return ONLY valid JSON with no additional text or formatting.`;
      
      userPrompt = `Create a complete product listing for this artisan item:

Product Name: ${productInfo.name}
Category: ${productInfo.category}
Price: $${productInfo.priceMin}${productInfo.priceMax ? ` - $${productInfo.priceMax}` : ''}
Description: ${productInfo.description}
Materials: ${productInfo.materials || 'Not specified'}
Techniques: ${productInfo.techniques || 'Handcrafted'}
Target Audience: ${productInfo.targetAudience || 'Art lovers'}
Additional Details: ${productInfo.additionalDetails || 'None'}

Return ONLY this JSON structure (no markdown, no extra text):
{
  "title": "Compelling product title (max 60 chars)",
  "subtitle": "Brief descriptive subtitle (max 80 chars)",
  "shortDescription": "Engaging 2-3 sentence summary (max 200 chars)",
  "keyFeatures": ["feature 1", "feature 2", "feature 3", "feature 4"],
  "specifications": {
    "materials": "${productInfo.materials || 'Mixed materials'}",
    "dimensions": "Varies",
    "technique": "${productInfo.techniques || 'Handcrafted'}",
    "style": "Artisan",
    "care": "Handle with care"
  },
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "story": "Brief artisan story (2-3 sentences max)"
}`;
    }

    console.log('Sending request for:', regenerateSection || 'full product');
    console.log('User prompt:', userPrompt);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Artisans Marketplace',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'x-ai/grok-4-fast:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: regenerateSection ? 300 : 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content;

    console.log('AI Raw Response:', content);

    // Clean up the response - remove markdown formatting if present
    content = content.replace(/``````\n?/g, '').trim();

    try {
      const enhancedProduct = JSON.parse(content);
      console.log('Parsed AI Response:', enhancedProduct);
      
      if (regenerateSection) {
        // For section regeneration, just return the specific field
        if (enhancedProduct[regenerateSection]) {
          return NextResponse.json({ 
            success: true, 
            enhancedProduct: { [regenerateSection]: enhancedProduct[regenerateSection] }
          });
        } else {
          throw new Error(`Section ${regenerateSection} not found in response`);
        }
      } else {
        // For full generation, validate required fields exist
        if (!enhancedProduct.title || !enhancedProduct.shortDescription) {
          throw new Error('Invalid AI response structure - missing required fields');
        }
        return NextResponse.json({ success: true, enhancedProduct });
      }
      
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw content that failed to parse:', content);
      
      if (regenerateSection) {
        // Create fallback for specific section
        const fallbackSection = createFallbackSection(regenerateSection, productInfo);
        return NextResponse.json({ 
          success: true, 
          enhancedProduct: { [regenerateSection]: fallbackSection }
        });
      } else {
        // Fallback: create a basic structure if JSON parsing fails
        const fallbackProduct = createFallbackProduct(productInfo);
        return NextResponse.json({ success: true, enhancedProduct: fallbackProduct });
      }
    }

  } catch (error) {
    console.error('Error generating product description:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate product description' 
    }, { status: 500 });
  }
}

function createFallbackSection(section: string, productInfo: any) {
  switch (section) {
    case 'title':
      return `${productInfo.name} - Handcrafted ${productInfo.category}`;
    case 'shortDescription':
      return `Beautiful handcrafted ${productInfo.name.toLowerCase()} made with ${productInfo.materials}. Perfect for collectors and gifts.`;
    case 'keyFeatures':
      return [
        'Handcrafted with care',
        `Made with ${productInfo.materials}`,
        'Unique artistic design',
        'Perfect for gifting'
      ];
    case 'highlights':
      return [
        'One-of-a-kind creation',
        'Artisan crafted',
        'High-quality materials'
      ];
    case 'specifications':
      return {
        materials: productInfo.materials || 'Mixed materials',
        dimensions: 'Varies',
        technique: productInfo.techniques || 'Handcrafted',
        style: 'Artisan',
        care: 'Handle with care'
      };
    case 'tags':
      return [
        'handmade',
        'artisan',
        productInfo.category?.toLowerCase().replace(/\s+/g, '-') || 'craft',
        'unique',
        'gift'
      ];
    case 'story':
      return `This beautiful ${productInfo.name.toLowerCase()} represents the artisan's dedication to quality craftsmanship using ${productInfo.materials}.`;
    default:
      return 'Enhanced content';
  }
}

function createFallbackProduct(productInfo: any) {
  return {
    title: `${productInfo.name} - Handcrafted ${productInfo.category}`,
    subtitle: `Beautiful ${productInfo.category} Creation`,
    shortDescription: productInfo.description || 'A beautiful handcrafted piece perfect for any collection.',
    keyFeatures: [
      'Handcrafted with care',
      `Made with ${productInfo.materials || 'quality materials'}`,
      'Unique artistic design',
      'Perfect for gifting'
    ],
    specifications: {
      materials: productInfo.materials || 'Mixed materials',
      dimensions: 'Varies',
      technique: productInfo.techniques || 'Handcrafted',
      style: 'Artisan',
      care: 'Handle with care'
    },
    highlights: [
      'One-of-a-kind creation',
      'Artisan crafted',
      'High-quality materials'
    ],
    tags: [
      'handmade',
      'artisan',
      productInfo.category?.toLowerCase().replace(/\s+/g, '-') || 'craft',
      'unique',
      'gift'
    ],
    story: `This beautiful piece represents the artisan's dedication to quality craftsmanship using ${productInfo.materials || 'carefully selected materials'}.`
  };
}
