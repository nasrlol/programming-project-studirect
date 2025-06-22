<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MatchController extends Controller
{
    /**
     * Get match percentage between a student and a company
     *
     * @param string $student_id
     * @param string $company_id
     * @return JsonResponse
     */
    public function getMatchPercentage(string $student_id, string $company_id): JsonResponse
    {
        try {
            $response = Http::get("{$this->apiUrl}match/{$student_id}/{$company_id}");

            if ($response->successful()) {
                $data = $response->json();

                // Log successful match fetch for debugging
                Log::info("Match percentage fetched successfully", [
                    'student_id' => $student_id,
                    'company_id' => $company_id,
                    'match_percentage' => $data['match_percentage'] ?? 0
                ]);

                return response()->json($data);
            } else {
                Log::warning("Match API returned non-successful response", [
                    'student_id' => $student_id,
                    'company_id' => $company_id,
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return response()->json(['match_percentage' => 0], 200);
            }
        } catch (\Exception $e) {
            Log::error("Error fetching match percentage", [
                'student_id' => $student_id,
                'company_id' => $company_id,
                'error' => $e->getMessage()
            ]);

            return response()->json(['match_percentage' => 0], 200);
        }
    }

    /**
     * Get match percentages for multiple companies for a specific student
     *
     * @param Request $request
     * @param string $student_id
     * @return JsonResponse
     */
    public function getMultipleMatches(Request $request, string $student_id): JsonResponse
    {
        $request->validate([
            'company_ids' => 'required|array',
            'company_ids.*' => 'required|integer'
        ]);

        $company_ids = $request->input('company_ids');
        $matches = [];

        foreach ($company_ids as $company_id) {
            try {
                $response = Http::get("{$this->apiUrl}match/{$student_id}/{$company_id}");

                if ($response->successful()) {
                    $data = $response->json();
                    $matches[$company_id] = $data['match_percentage'] ?? 0;
                } else {
                    $matches[$company_id] = 0;
                }
            } catch (\Exception $e) {
                Log::error("Error fetching match for company {$company_id}", [
                    'student_id' => $student_id,
                    'company_id' => $company_id,
                    'error' => $e->getMessage()
                ]);
                $matches[$company_id] = 0;
            }
        }

        return response()->json(['matches' => $matches]);
    }

    /**
     * Get companies sorted by match percentage for a student
     *
     * @param string $student_id
     * @return JsonResponse
     */
    public function getSortedCompaniesByMatch(string $student_id): JsonResponse
    {
        try {
            // First get all companies
            $companiesResponse = Http::get("{$this->companiesApiUrl}");

            if (!$companiesResponse->successful()) {
                return response()->json(['error' => 'Failed to fetch companies'], 500);
            }

            $companies = $companiesResponse->json('data');
            $companiesWithMatches = [];

            // Fetch match percentage for each company
            foreach ($companies as $company) {
                try {
                    $matchResponse = Http::get("{$this->apiUrl}match/{$student_id}/{$company['id']}");

                    if ($matchResponse->successful()) {
                        $matchData = $matchResponse->json();
                        $company['match_percentage'] = $matchData['match_percentage'] ?? 0;
                    } else {
                        $company['match_percentage'] = 0;
                    }
                } catch (\Exception $e) {
                    $company['match_percentage'] = 0;
                }

                $companiesWithMatches[] = $company;
            }

            // Sort by match percentage (highest first)
            usort($companiesWithMatches, function($a, $b) {
                return ($b['match_percentage'] ?? 0) <=> ($a['match_percentage'] ?? 0);
            });

            return response()->json(['companies' => $companiesWithMatches]);

        } catch (\Exception $e) {
            Log::error("Error getting sorted companies by match", [
                'student_id' => $student_id,
                'error' => $e->getMessage()
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Get companies that a student has liked (for matches/chat)
     *
     * @param string $student_id
     * @return JsonResponse
     */
    public function getLikedCompaniesByStudent(string $student_id): JsonResponse
    {
        try {
            // Get all connections for this student
            $connectionsResponse = Http::get("{$this->connectionsApiUrl}");

            if (!$connectionsResponse->successful()) {
                return response()->json(['error' => 'Failed to fetch connections'], 500);
            }

            $allConnections = $connectionsResponse->json('data');

            // Filter to only liked connections (status = true) for this student
            $likedConnections = collect($allConnections)
                ->where('student_id', $student_id)
                ->where('status', true)
                ->all();

            if (empty($likedConnections)) {
                return response()->json(['companies' => []]);
            }

            // Get company IDs that were liked
            $likedCompanyIds = collect($likedConnections)->pluck('company_id')->toArray();

            // Fetch all companies
            $companiesResponse = Http::get("{$this->companiesApiUrl}");

            if (!$companiesResponse->successful()) {
                return response()->json(['error' => 'Failed to fetch companies'], 500);
            }

            $allCompanies = $companiesResponse->json('data');

            // Filter companies to only include liked ones
            $likedCompanies = collect($allCompanies)
                ->whereIn('id', $likedCompanyIds)
                ->values()
                ->toArray();

            return response()->json(['companies' => $likedCompanies]);

        } catch (\Exception $e) {
            Log::error("Error getting liked companies by student", [
                'student_id' => $student_id,
                'error' => $e->getMessage()
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
