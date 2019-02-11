package com.buttercup.autofill;

import android.annotation.TargetApi;
import android.app.PendingIntent;
import android.app.assist.AssistStructure;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Build;
import android.os.CancellationSignal;
import android.service.autofill.AutofillService;
import android.service.autofill.Dataset;
import android.service.autofill.FillCallback;
import android.service.autofill.FillContext;
import android.service.autofill.FillRequest;
import android.service.autofill.FillResponse;
import android.service.autofill.SaveCallback;
import android.service.autofill.SaveRequest;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.autofill.AutofillId;
import android.view.autofill.AutofillValue;
import android.widget.RemoteViews;

import com.buttercup.MainActivity;
import com.buttercup.MainApplication;
import com.buttercup.R;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.List;

@TargetApi(Build.VERSION_CODES.O)
public class BCAutoFillService extends AutofillService {
    private static final String TAG = "BCAutoFillService";
    @Override
    public void onFillRequest(@NonNull FillRequest request,
                              @NonNull CancellationSignal cancellationSignal, @NonNull FillCallback callback) {
        Log.d(TAG, "onFillRequest");

        // Needed to pull our autofill entries from RNSecureStorage
        ReactApplicationContext reactContext = new ReactApplicationContext(getApplicationContext());
        AutoFillHelpers autoFillHelper = new AutoFillHelpers(reactContext);

        // Get the structure from the request
        List<FillContext> context = request.getFillContexts();
        AssistStructure structure = context.get(context.size() - 1).getStructure();

        // Parse the structure into fillable view IDs
        StructureParser.Result parseResult = new StructureParser(structure).parse();

        // Add a dataset to the response
        FillResponse.Builder fillResponseBuilder = new FillResponse.Builder();

        try {
            for (String domain: parseResult.webDomain) {
                // Search Buttercup Entries that match this domain name
                ArrayList<AutoFillEntry> matchedEntries = autoFillHelper.getAutoFillEntriesForDomain(domain);
                for (AutoFillEntry entry: matchedEntries) {
                    // Build the presentation of the datasets
                    RemoteViews remoteView = new RemoteViews(getPackageName(), R.layout.autofill_list_item);
                    remoteView.setTextViewText(R.id.autofill_username, "Login with " + entry.getUsername());
                    remoteView.setTextViewText(R.id.autofill_domain, entry.getEntryPath());
                    Dataset.Builder builder = new Dataset.Builder(remoteView);

                    // Assign the username/password to any found view IDs
                    parseResult.email.forEach(id -> builder.setValue(id, AutofillValue.forText(entry.getUsername())));
                    parseResult.username.forEach(id -> builder.setValue(id, AutofillValue.forText(entry.getUsername())));
                    parseResult.password.forEach(id -> builder.setValue(id, AutofillValue.forText(entry.getPassword())));

                    Dataset dataSet = builder.build();
                    fillResponseBuilder.addDataset(dataSet);
                }
            }


            // Add the Login With Buttercup option
            RemoteViews remoteView = new RemoteViews(getPackageName(), R.layout.autofill_list_item);
            remoteView.setTextViewText(R.id.autofill_username, "Continue with Buttercup ");
            remoteView.setTextViewText(R.id.autofill_domain, "Login to Buttercup for more...");

            // Create the sender intent so that we can start the Buttercup app and let the user choose a credential
            Intent authIntent = new Intent(this, AutoFillActivity.class);

            // Add the domain names to the intent for Search to work in the app
            String[] serviceIdentifiers = new String[parseResult.webDomain.size()];
            authIntent.putExtra("serviceIdentifiers", parseResult.webDomain.toArray(serviceIdentifiers));
            IntentSender intentSender = PendingIntent.getActivity(
                    this,
                    1001,
                    authIntent,
                    PendingIntent.FLAG_CANCEL_CURRENT
            ).getIntentSender();

            // Finally build the Login with Buttercup dataset and add it to the list
            Dataset.Builder builder = new Dataset.Builder(remoteView);
            builder.setAuthentication(intentSender);

            // Note the dataset MUST have values set. These aren't actually used so we'll just fill dummy values out
            parseResult.email.forEach(id -> builder.setValue(id, AutofillValue.forText("-")));
            parseResult.username.forEach(id -> builder.setValue(id, AutofillValue.forText("-")));
            parseResult.password.forEach(id -> builder.setValue(id, AutofillValue.forText("-")));
            Dataset dataSet = builder.build();
            fillResponseBuilder.addDataset(dataSet);

            callback.onSuccess(fillResponseBuilder.build());
        } catch (Exception ex) {
            Log.e(TAG, ex.getMessage());
            callback.onSuccess(null);
        }
    }

    @Override
    public void onSaveRequest(@NonNull SaveRequest request, @NonNull SaveCallback callback) {
        Log.d(TAG, "onSaveRequest");
        callback.onFailure("Unfortunately Buttercup does not support saving credentials yet.");
    }

    @Override
    public void onConnected() {
        Log.d(TAG, "onConnected");
    }

    @Override
    public void onDisconnected() {
        Log.d(TAG, "onDisconnected");
    }
}
