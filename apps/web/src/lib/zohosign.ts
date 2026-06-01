import axios from "axios";
import FormData from "form-data";

const ZOHO_SIGN_API_URL = "https://sign.zoho.eu/api/v1";

/**
 * Récupère un jeton d'accès frais via le Refresh Token de Zoho
 */
async function getAccessToken() {
  try {
    const response = await axios.post("https://accounts.zoho.eu/oauth/v2/token", null, {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      },
    });
    return response.data.access_token;
  } catch (error: any) {
    console.error("Zoho OAuth Error:", error.response?.data || error.message);
    throw new Error("Impossible de rafraîchir le jeton Zoho Sign");
  }
}

/**
 * Crée et envoie une demande de signature via Zoho Sign
 */
export async function createZohoSignatureRequest(params: {
  title: string;
  clientEmail: string;
  clientName: string;
  fileBuffer: Buffer;
  fileName: string;
}) {
  const accessToken = await getAccessToken();

  try {
    // 1. Préparer le formulaire multipart
    const form = new FormData();
    form.append("file", params.fileBuffer, params.fileName);
    
    const data = {
      requests: {
        request_name: params.title,
        actions: [
          {
            recipient_name: params.clientName,
            recipient_email: params.clientEmail,
            action_type: "SIGN",
            signing_order: 0,
            verify_recipient: false,
          },
        ],
        is_sequential: true,
      },
    };
    
    form.append("data", JSON.stringify(data));

    // 2. Créer la requête (Upload du document)
    const createResponse = await axios.post(`${ZOHO_SIGN_API_URL}/requests`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });

    const requestId = createResponse.data.requests.request_id;

    // 3. Envoyer la requête (Submit)
    await axios.post(
      `${ZOHO_SIGN_API_URL}/requests/${requestId}/submit`,
      null,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );

    return { success: true, requestId };
  } catch (error: any) {
    console.error("Zoho Sign API Error:", error.response?.data || error.message);
    return { success: false, error: "Échec de la procédure de signature" };
  }
}
